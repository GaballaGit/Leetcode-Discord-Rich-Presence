//This is the frontend, I fetch data here and send it to backend
async function sendDataToBackend(title, url)
{
    try
    {
        const response = await fetch('http://localhost:5000/update-rpc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                url: url
            })
        });

        const result = await response.text();
        console.log('Backend response: ', result);
    }
    catch (error)
    {
        console.error('Error sending data to backend ', error);
    }
}

//When the window is closed
window.addEventListener('beforeunload', () => {
    fetch('http://localhost:5000/close-rpc', {method: 'POST'});
});

//Converts the slug to a title
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

//Fetch data from leetcode
async function fetchSiteData()
{
    console.log("Fetching data...");
    const url = window.location.href;
    
    if (url === 'https://leetcode.com/problemset/')
    {
        sendDataToBackend('Browsing problems', 'https://leetcode.com/problemset/');
    }
    else
    {
        let currentSlug = url.split('/').slice(-3, -2)[0]; 
        let i = 0;

        while (currentSlug === 'problems' && i < 10) {
            currentSlug = url.split('/').slice(-3 + i, -2 + i)[0];
            i++;
        }
        url.split('/').slice(-3,-2)[0];
        console.log(currentSlug, `https://leetcode.com/api/problems/${currentSlug}/`);
        console.log(slugToTitle(currentSlug));

        try
        {
            const response = await fetch(`https://leetcode.com/api/problems/${currentSlug}/`);
            const data = await response.json();
            console.log(data);

            sendDataToBackend(slugToTitle(currentSlug), `https://leetcode.com/api/problems/${currentSlug}`);
        }

        catch (error)
        {
            console.error('Error fetching data: ', error);
        }
    }
    
}

fetchSiteData();
