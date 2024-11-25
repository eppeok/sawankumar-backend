const config = require("../config");
const axios = require("axios");

const headers = {
  Authorization: `Bearer ${config.ghlAccessToken}`, // Removed extra space
  "Content-Type": "application/json",
  Version: "2021-07-28",
};

// only client will use this method to create a new register
const demoRequest = async (req, res) => {
  res.send("This is Canva mastery");
};

const createContact = async (req, res) => {
  try {
    const { email, phone, fullName, tags = [] } = req.body;

    // Check by email
    const emailResponse = await axios.get(
      `https://services.leadconnectorhq.com/contacts/?locationId=dsWjBGIxUq1LzZXzCB9c&limit=10&query=${email}`,
      {
        headers: { ...headers },
      }
    );
    const emailExists = emailResponse.data.contacts.length > 0;
    const emailContact = emailExists ? emailResponse.data.contacts?.[0] : null;

    // Check by phone
    const phoneResponse = await axios.get(
      `https://services.leadconnectorhq.com/contacts/?locationId=dsWjBGIxUq1LzZXzCB9c&limit=10&query=%2B91${phone}`,
      {
        headers: { ...headers },
      }
    );
    const phoneExists = phoneResponse.data.contacts.length > 0;
    const phoneContact = phoneExists ? phoneResponse.data.contacts?.[0] : null;

    if (emailExists && phoneExists) {
      if (emailContact.id === phoneContact.id) {
        return res.send({
          message: "Both email and phone exist and belong to the same contact",
          contact: emailContact,
        });
      } else {
        return res.send({ message: "Both email and phone exist" });
      }
    } else if (emailExists && !phoneExists) {
      // Update contact with phone number
      const response = await axios.put(
        `https://services.leadconnectorhq.com/contacts/${emailContact.id}`,
        { phone, name: fullName },
        {
          headers: { ...headers },
        }
      );
      return res.send({
        message: "Updated contact with phone number",
        contact: response.data.contact,
      });
    } else if (!emailExists && phoneExists) {
      // Update contact with email
      const response = await axios.put(
        `https://services.leadconnectorhq.com/contacts/${phoneContact.id}`,
        { email, name: fullName },
        {
          headers: { ...headers },
        }
      );
      return res.send({
        message: "Updated contact with email",
        contact: response.data.contact,
      });
    } else {
      // Insert new contact
      const response = await axios.post(
        "https://services.leadconnectorhq.com/contacts",
        {
          name: fullName,
          email: email,
          locationId: "dsWjBGIxUq1LzZXzCB9c",
          phone,
          address1: "",
          timezone: "Asia/Calcutta",
          country: "IN",
          companyName: "",
          tags: tags,
        },
        {
          headers: { ...headers },
        }
      );
      return res.send({
        message: "New contact inserted",
        contact: response.data.contact,
      });
    }
  } catch (error) {
    console.log("Error while checking if contact exists:", error);
    return res
      .status(500)
      .send({ error: "Error while checking if contact exists", info: error });
  }
};

const updateContact = async (req, res) => {
  try {
    const { contactId, data } = req.body;
    if (!contactId) {
      return res.status(400).send("Contact ID is required");
    }

    const response = await axios.put(
      `https://services.leadconnectorhq.com/contacts/${contactId}`,
      { ...data },
      {
        headers: { ...headers },
      }
    );
    console.log(response.data);
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error while updating contact:", error);
    res.status(500).send("Error while updating contact");
  }
};
module.exports = { demoRequest, createContact, updateContact };
