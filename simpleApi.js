require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8000;

const TURBONOMIC_BASE_URL = process.env.TURBONOMIC_BASE_URL;
const GC_CHAT_WEBHOOK = process.env.GC_CHAT_WEBHOOK;

app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
	console.log("Received payload:", JSON.stringify(req.body, null, 2));

	// Determine handler based on target.className
	const targetClassName = extractVariable(req.body, "target.className");

	try {
		if (targetClassName === "VirtualMachine" || targetClassName === "VirtualVolume") {
			await handleScaleAction(req.body, targetClassName);
		} else {
			await handleNotImplemented(req.body, targetClassName);
		}
		res.status(200).send("Webhook processed successfully.");
	} catch (error) {
		console.error("Error processing webhook:", error.message);
		res.status(500).send("Error processing webhook.");
	}
});

async function handleScaleAction(payload, targetClassName) {
	const actionId = extractVariable(payload, "uuid");
	const actionUrl = `${TURBONOMIC_BASE_URL}/app/#/view/main/action/${actionId}`;

	let messageTitle = "Turbonomic Scale Action";
	if (targetClassName === "VirtualMachine") {
		messageTitle = "Turbonomic Scale Action - Virtual Machine";
	} else if (targetClassName === "VirtualVolume") {
		messageTitle = "Turbonomic Scale Action - Volume";
	}

	const costText = getCost(payload, targetClassName);

	const message = {
		cardsV2: [
			{
				cardId: "turbonomic-action-scale",
				card: {
					header: {
						title: messageTitle,
						subtitle: `Action ID: ${actionId}`,
						imageUrl: "https://pbs.twimg.com/profile_images/1677090954350583811/Xy93qVY4_400x400.jpg",
						imageType: "CIRCLE",
					},
					sections: [
						{
							header: extractVariable(payload, "details"),
							collapsible: true,
							uncollapsibleWidgetsCount: 1,
							widgets: [
								{
									textParagraph: {
										text: `<b>Target:</b> ${extractVariable(payload, "target.displayName")} (${targetClassName})`,
									},
								},
								{
									textParagraph: {
										text: `<b>Current Entity:</b> ${extractVariable(payload, "currentEntity.displayName")}`,
									},
								},
								{
									textParagraph: {
										text: `<b>New Entity:</b> ${extractVariable(payload, "newEntity.displayName")}`,
									},
								},
								{
									textParagraph: {
										text: `<b>Cost:</b> ${costText}`,
									},
								},
								{
									textParagraph: {
										text: `<b>Risk Assessment:</b> ${extractVariable(payload, "risk.subCategory")} - ${extractVariable(
											payload,
											"risk.severity"
										)}<br>${extractVariable(payload, "risk.description")}`,
									},
								},
								{
									textParagraph: {
										text: `<b>Location:</b> ${extractVariable(payload, "currentLocation.displayName")} to ${extractVariable(
											payload,
											"newLocation.displayName"
										)}`,
									},
								},
								{
									textParagraph: {
										text: `<b>🔗 Action Link:</b> <a href="${actionUrl}">View Action</a>`,
									},
								},
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
	console.log("Scale Action forwarded to Google Chat:", response.data);
}

async function handleNotImplemented(payload, targetClassName) {
	const actionId = extractVariable(payload, "uuid");
	const actionUrl = `${TURBONOMIC_BASE_URL}/app/#/view/main/action/${actionId}`;

	const message = {
		cardsV2: [
			{
				cardId: "turbonomic-action-not-implemented",
				card: {
					header: {
						title: `Unhandled Scale Action - ${targetClassName}`,
						subtitle: `Action ID: ${actionId}`,
						imageUrl: "https://pbs.twimg.com/profile_images/1677090954350583811/Xy93qVY4_400x400.jpg",
						imageType: "CIRCLE",
					},
					sections: [
						{
							header: "Handler not implemented for this target type",
							collapsible: true,
							uncollapsibleWidgetsCount: 1,
							widgets: [
								{
									textParagraph: {
										text: `No handler implemented for target type: ${targetClassName}. Please implement a handler for this type.`,
									},
								},
								{
									textParagraph: {
										text: `<b>🔗 Action Link:</b> <a href="${actionUrl}">View Action</a>`,
									},
								},
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
	console.log("Unhandled action forwarded to Google Chat:", response.data);
}

function getCost(payload, targetClassName) {
	let value = "N/A";
	let units = "N/A";

	if (targetClassName === "VirtualMachine") {
		if (payload.stats && Array.isArray(payload.stats)) {
			const stat = payload.stats.find((s) => s.name === "costPrice") || payload.stats[0];
			if (stat) {
				value = stat.value;
				units = stat.units;
			}
		}
	} else if (targetClassName === "VirtualVolume") {
		if (payload.virtualDisks && Array.isArray(payload.virtualDisks)) {
			// Iterate over virtualDisks to find a costPrice stat
			for (const disk of payload.virtualDisks) {
				if (disk.stats && Array.isArray(disk.stats)) {
					const stat = disk.stats.find((s) => s.name === "costPrice");
					if (stat) {
						value = stat.value;
						units = stat.units;
						break;
					}
				}
			}
		}
	}
	return `${value} ${units}`;
}

function extractVariable(obj, path) {
	return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : "N/A"), obj);
}

app.listen(port, () => {
	console.log(`Webhook server running on port ${port}`);
});
