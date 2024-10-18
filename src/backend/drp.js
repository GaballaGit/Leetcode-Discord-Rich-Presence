//Because discord requires ICP with its nodejs module (I think?). I split this part into the backend.
import cors from 'cors';
import DiscordRPC from 'discord-rpc';
import functions from 'firebase-functions';
import express from 'express';
const app = express();



app.use(cors({
    origin: 'https://leetcode.com',
    methods: ['GET,POST,OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

const clientID = '1287257520217526395';
const RPC = new DiscordRPC.Client({ transport : 'ipc' });

DiscordRPC.register(clientID);


app.post('/update-rpc', async (req, res) => {
    const { title, diff, url } = req.body;
    try {
        await setActivity(title, diff, url);
        res.status(200).send('RPC Updated Successfully');
    } catch (err) {
        console.error('Error setting activity: ', err);
        res.status(500).send('Error updating RPC');
    }
});

// Handle closeRPC request
app.post('/close-rpc', (req, res) => {
    RPC.clearActivity()
        .then(() => {
            res.status(200).send('RPC closed successfully');
        })
        .catch(err => {
            console.error('Error closing RPC: ', err);
            res.status(500).send('Error closing RPC');
        });
});

exports.updateRPC = functions.https.onRequest(app);
exports.closeRPC = functions.https.onRequest(app);

//clean shutdown, SIGINT is a signal that is like ctrl + C on a terminal, clears activity and exits out with status 0 to let know, there was a clean shutdown
/*exports.updateRPC = functions.https.onRequest((req, res) => {
    cors(corsOptions)(req, res, () => {
        const {title, diff, url} = req.body;

        setActivity(title, diff, url)
            .then(() => {
                res.status(200).send('RPC Updated Successfully');
            })
            .catch(err => {
                console.error('Error setting activity: ', err);
                res.status(500).send('Error updating RPC');
            });
    });
});

exports.closeRPC = functions.https.onRequest((req, res) => {
    cors(corsOptions)(req, res, () => {
        RPC.clearActivity()
            .then(() => {
                res.status(200).send('RPC closed successfully');
            })
            .catch(err => {
                console.error('Error closing RPC: ', err);
                res.status(500).send('Error closing RPC');
            });
    });
});
*/

//Set discord activity
async function setActivity(title, diff, url) {
    if (!RPC) return;
    const activity = {
        details: `${title}`,
        
        startTimestamp: Date.now(),
        largeImageKey: 'leetcode-icon',
        largeImageText: 'Leetcode',
        //smallImageKey: '',
        //smallImageText: '',
        instance: false,
    };
    if (diff)
    {
        activity.state = diff
    }
    if (url)
    {
        activity.buttons = [
            {
                label: 'Check out problem',
                url: `${url}`
            }
        ]
    }
    RPC.setActivity(activity);
};

//Default
RPC.on('ready', async () => {
    console.log('Discord RPC is Ready!');
    setActivity('Browsing Problems', undefined,undefined);
});

RPC.login({clientId : clientID}).catch(err => console.error(err));


