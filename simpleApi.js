const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 8000;

const TURBONOMIC_BASE_URL = ;
const GC_CHAT_WEBHOOK =;

app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
	console.log(req.body);
	console.log("Received webhook payload:", JSON.stringify(req.body, null, 2));

	try {
		const actionId = extractVariable(req.body, "uuid");
		const actionUrl = `${TURBONOMIC_BASE_URL}/app/#/view/main/action/${actionId}`;

		const message = {
			cardsV2: [
				{
					cardId: "turbonomic-action-card",
					card: {
						header: {
							title: "Turbonomic Action",
							subtitle: `Action ID: ${actionId}`,
							imageUrl: "https://pbs.twimg.com/profile_images/1677090954350583811/Xy93qVY4_400x400.jpg",
							imageType: "CIRCLE",
						},
						sections: [
							{
								header: extractVariable(req.body, "details"),
								collapsible: true,
								uncollapsibleWidgetsCount: 1,
								widgets: [
									{ textParagraph: { text: `<b>Action Type:</b> ${extractVariable(req.body, "actionType")} <br>` } },
									{
										textParagraph: {
											text: `<b>State:</b> ${extractVariable(req.body, "actionState")} <br><b>Mode:</b> ${extractVariable(req.body, "actionMode")}`,
										},
									},
									{
										textParagraph: {
											text: `<b>Target:</b> ${extractVariable(req.body, "target.displayName")} (${extractVariable(req.body, "target.className")})`,
										},
									},
									{
										textParagraph: {
											text: `<b>Current Value:</b> ${extractVariable(req.body, "currentEntity.displayName")} <br><b>New Value:</b> ${extractVariable(
												req.body,
												"newEntity.displayName"
											)}`,
										},
									},
									{
										textParagraph: {
											text: `<b>Cost Savings:</b> ${extractVariable(req.body, "stats[0].value")} ${extractVariable(req.body, "stats[0].units")}`,
										},
									},
									{
										textParagraph: {
											text: `<b>Risk Assessment:</b> <br>- Category: ${extractVariable(
												req.body,
												"risk.subCategory"
											)} <br>- Severity: ${extractVariable(req.body, "risk.severity")} <br>- Reason: ${extractVariable(
												req.body,
												"risk.description"
											)}`,
										},
									},
									{
										textParagraph: {
											text: `<b>Location:</b> ${extractVariable(req.body, "currentLocation.displayName")} to ${extractVariable(
												req.body,
												"newLocation.displayName"
											)}`,
										},
									},
									{ textParagraph: { text: `<b>🔗 Action link:</b><br><a href="${actionUrl}">View Action in Turbonomic</a>` } },
								],
							},
						],
					},
				},
			],
		};

		const response = await axios.post(GC_CHAT_WEBHOOK, message, {
			headers: { "Content-Type": "application/json" },
		});

		console.log("Forwarded to Google Chat:", response.data);
		res.status(200).send("Webhook processed successfully.");
	} catch (error) {
		console.error("Error forwarding to Google Chat:", error.message);
		res.status(500).send("Error processing webhook.");
	}
});

function extractVariable(obj, path) {
	return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : "N/A"), obj);
}

app.listen(port, () => {
	console.log(`Webhook server running on port ${port}`);
});
