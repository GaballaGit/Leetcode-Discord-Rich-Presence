//This is the frontend, I fetch data here and send it to backend
//const axios = require("axios");
//const setupDiscordRPC = require("./drp.js");

console.log("Testing!");
//Get Leetcode 

function slugToTitle(slug)
{
    const words = slug.split('-');

    const formattedWords = words.map(word => {
        if (word.length > 2)
        {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
    });

    return formattedWords.join(' ');
}

async function fetchSiteData() {
    //TODO: figure out what I want to get from Leetcodes JSON
    //const response = axios.get('https://leetcode.com/api/problems/all/');
    console.log("Fetching data...");
    const url = window.location.href;
    const currentSlug = url.split('/').slice(-3,-2)[0];
    console.log(currentSlug, `https://leetcode.com/api/problems/${currentSlug}/`);
    console.log(slugToTitle(currentSlug));
    try
    {
        const response = await fetch(`https://leetcode.com/api/problems/${currentSlug}/`);
        const data = await response.json();
        //const userName = data.user_name;
        //console.log("Data for", userName, ": ");
        console.log(data);

        

        //console.log("Current Problem: ", currentSlug);
        //console.log("Problem Url: ", url);

        /*const currentProblem = data.statements.find(problem => problem.slug === currentSlug);
        if (currentProblem)
        {
            const title = currentProblem.title;
            const url = 'https://leetcode.com/problems/${currentProblem.slug}/';
            console.log("Current Problem: ", title);
            console.log("Problem Url: ", url);
        }*/
    }
    catch (error)
    {
        console.error('Error fetching data: ', error);
    }
}
fetchSiteData();
//setupDiscordRPC();