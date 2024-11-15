const config = require("../config");
const axios = require("axios");

const headers = {
  Authorization: `Bearer pit-2863e592-02f4-43a4-afd6-f0bf1b943681`, // Removed extra space
  "Content-Type": "application/json",
  Version: "2021-07-28",
};

// only client will use this method to create a new register
const demoRequest = async (req, res) => {
  res.send("This is Canva mastery");
};

const createContact = async (req, res) => {
  try {
    const { phone, email, fullName, tags = [] } = req.body;

    //create new contact
    const response = await axios.post(
      "https://services.leadconnectorhq.com/contacts",
      {
        name: fullName,
        email: email,
        locationId: "dsWjBGIxUq1LzZXzCB9c",
        phone,
        address1: "",
        // website: "http://localhost:3000/canvaMastery", // add the path of the website
        timezone: "Asia/Calcutta",
        country: "IN",
        companyName: "",
        tags: tags,
      },
      {
        headers: { ...headers },
      }
    );
    res.status(200).json(response.data.contact);
  } catch (error) {
    console.error("Error while creating contact:", error);
    res.status(500).json({ error: "Error while creating contact" });
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
