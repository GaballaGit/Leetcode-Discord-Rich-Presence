const axios = require("axios");
const setupDiscordRPC = require("./drp.js");

//Get Leetcode 
async function fetchSiteData() {
    //TODO: figure out what I want to get from Leetcodes JSON
    const response = axios.get('https://leetcode.com/api/problems/all/');
}
setupDiscordRPC();