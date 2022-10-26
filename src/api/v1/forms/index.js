const express = require("express");

const router = express.Router();

const FormsModel = require("../../../models/Forms");
const PublishedFormsModel = require("../../../models/PublishedForms");
const InsightsModel = require("../../../models/Insights");
const ResponsesModel = require("../../../models/Responses");
const { validateToken } = require("../../../utils/common");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../../utils/constants");
const logger = require("../../../utils/logger");

// GET all forms for user
router.get("/", async (req, res) => {
    try {
        const token = await validateToken(req.headers);

        if (token.error) {
            return res
                .status(token.status)
                .json({ error: true, message: token.message });
        }

        const { userId } = token;

        const forms = await FormsModel.find({ ownerId: userId }).sort({
            createdAt: -1
        });

        const data = [];

        for (let i = 0; i < forms.length; i += 1) {
            const responses = await ResponsesModel.countDocuments({
                formRef: forms[i].formRef
            });

            data.push({ ...forms[i]._doc, responses });
        }

        return res.status(200).json({ success: true, data });
    } catch (error) {
        logger.error("GET /api/v1/forms -> error : ", error);

        return res
            .status(500)
            .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
});

// GET a particular form for user
router.get("/:formRef", async (req, res) => {
    try {
        const token = await validateToken(req.headers);

        if (token.error) {
            return res
                .status(token.status)
                .json({ error: true, message: token.message });
        }

        const { userId } = token;

        const { formRef } = req.params;

        const form = await FormsModel.findOne({ ownerId: userId, formRef });

        if (!form) {
            return res
                .status(400)
                .json({ success: false, message: "Form does not exists." });
        }

        return res.status(200).json({ success: true, data: form });
    } catch (error) {
        logger.error("GET /api/v1/forms/:formRef -> error : ", error);

        return res
            .status(500)
            .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
    }
});