const express = require("express");
const { AWS_REGION } = require("../../../utils/config");

const AWS = require("aws-sdk");
AWS.config.update({ region: AWS_REGION });

const router = express.Router();
const ResponsesModel = require("../../../models/Responses");
const FormsModel = require("../../../models/Forms");
const UsersModel = require("../../../models/Users");
const { AWS_FROM_EMAIL } = require("../../../utils/config");
const {
  QuestionType,
  INTERNAL_SERVER_ERROR_MESSAGE,
} = require("../../../utils/constants");
const logger = require("../../../utils/logger");

const renderAnswer = (response) => {
  if (response.type === QuestionType.STATEMENT) {
    return "This is a statement, hence no response will be recorded.";
  }

  if (response.type === QuestionType.DATE) {
    return moment(response.answer).format("LLL");
  }

  if (
    response.type === QuestionType.MULTIPLE_CHOICE ||
    response.type === QuestionType.DROPDOWN
  ) {
    if (!response.answer.length) {
      return "No Response";
    }

    return response.answer.toString();
  }

  if (!response.answer) {
    return "No Response";
  }

  return response.answer;
};

const createResponseTemplate = (response) =>
  `${response.map(
    (elem) =>
      `<p>
          <span>
            ${elem.number}) ${elem.questionValue}
          </span>

          <br />

          <span>${renderAnswer(elem)}</span>
        </p>
      `
  )}  
  `;

// POST response for a particular form using AWS
router.post("/", async (req, res) => {
  try {
    const { formRef, responseRef, response } = req.body;

    // save response
    await new ResponsesModel({
      formRef,
      responseRef,
      response,
    }).save();

    const form = await FormsModel.findOne({ formRef });

    if (form.isEmailNotificationEnabled) {
      const { ownerId } = form;

      const user = await UsersModel.findById(ownerId);

      const { email } = user;
      // Create sendEmail params
      const params = {
        Source: AWS_FROM_EMAIL,
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Subject: {
            Charset: "UTF-8",
            Data: "Your form received a new response!",
          },
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: createResponseTemplate(response),
            },
          },
        },
      };

      // send email notification for response
      const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
        .sendEmail(params)
        .promise();

      // Handle promise's fulfilled/rejected states
      sendPromise
        .then(function (data) {
          logger.info(data.MessageId);
        })
        .catch(function (err) {
          logger.error(err, err.stack);
        });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error("POST /api/v1/responses -> error : ", error);

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

// GET responses for a particular form
router.get("/:formRef", async (req, res) => {
  try {
    const { formRef } = req.params;

    const responses = await ResponsesModel.find({
      formRef,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ success: true, data: responses });
  } catch (error) {
    logger.error("GET /api/v1/responses -> error : ", error);

    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
