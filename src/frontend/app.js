//This is the frontend, I fetch data here and send it to backend
//For deployment to production, I need to use the actual Firebase hosting URL (e.g., https://<your-app>.cloudfunctions.net/updateRPC) when the functions are deployed to Firebase.
async function sendDataToBackend(title, diff, url)
{
    try
    {
        const response = await fetch('http://localhost:5001/leetcode-drp/us-central1/updateRPC', {
            mode: 'no-cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                diff: diff,
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
    fetch('http://localhost:5001/leetcode-drp/us-central1/closeRPC', {method: 'POST'});
});

function getSlugfromURL(url)
{
    const pathSegments = new URL(url).pathname.split('/').filter(segment => segment);
    const problemsIndex = pathSegments.indexOf('problems');
    if (problemsIndex !== -1 && problemsIndex + 1 < pathSegments.length)
    {
        return pathSegments[problemsIndex + 1];
    }
    return null;
}

//Fetch data from leetcode
async function fetchSiteData()
{
    console.log("Fetching data...");
    const url = window.location.href;
    
    if (url.includes('https://leetcode.com/problemset/'))
    {
        sendDataToBackend('Browsing Problems', undefined, undefined);
    }
    else
    {

        let currentSlug = getSlugfromURL(url);
        
        try
        {
            const response = await fetch(`https://leetcode.com/api/problems/all/`);
            const data = await response.json();
            console.log(data);

            const problem = data.stat_status_pairs.find(prob => prob.stat.question__title_slug === currentSlug);
            if (problem) 
            {
                const title = problem.stat.question__title;
                var difficulty = ''
                switch (problem.difficulty.level)
                {
                    case 1:
                        difficulty = 'Easy';
                        break;
                    case 2:
                        difficulty = 'Medium';
                        break;
                    case 3:
                        difficulty = 'Hard';
                        break;
                    
                }
                console.log(`Title: ${title}`);
                console.log(`Difficulty: ${difficulty}`);
                sendDataToBackend(title, difficulty, url);
            }
            else
            {
                console.log('Problem not found!');
            }
        }

        catch (error)
        {
            console.error('Error fetching data: ', error);
        }
    }
    
}

fetchSiteData();
