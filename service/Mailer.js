const nodemailer = require("nodemailer");
const Queue = require("bull");
require("dotenv").config();

const emailQueue = new Queue("emailQueue", "redis://127.0.0.1:6379");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ghoghariforam8@gmail.com",
    pass: process.env.APP_PASS,
  },
});

emailQueue.process(async (job) => {
  const { to, subject, body } = job.data;

  console.log(`Processing email for: ${to}`);

  const mailOptions = {
    from: "ghoghariforam8@gmail.com",
    to: to,
    subject: subject,
    text: body,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
});

emailQueue.on("completed", (job) => {
  console.log(`Email for ${job.data.to} sent successfully.`);
});

emailQueue.on("failed", (job, error) => {
  console.error(`Email for ${job.data.to} failed:`, error);
});

emailQueue.on("waiting", (jobId) => {
  console.log("Waiting for job:", jobId);
});

emailQueue.on("stalled", (jobId) => {
  console.log("Job stalled:", jobId);
});

const SendMailer = async (data) => {
  try {
    await emailQueue.add(data, {
      attempts: 3,
      backoff: 5000,
    });
    console.log("Email task added to the queue");
  } catch (error) {
    console.error("Failed to add email task to queue:", error);
  }
};

module.exports = SendMailer;
