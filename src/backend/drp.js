//Because discord requires ICP with its nodejs module (I think?). I split this part into the backend.
import express from 'express';
import cors from 'cors';
import DiscordRPC from 'discord-rpc';
import rateLimit from 'express-rate-limit';


const app = express();
const PORT = 5000;

const clientID = '1287257520217526395';
const RPC = new DiscordRPC.Client({ transport : 'ipc' });

//using cors allow request from leetcode
app.use(cors({
    origin: 'https://leetcode.com',
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: 'Content-Type',
    credentials: true
}));

//Limiting requests so I dont have to deal with (cough) unexpected expenses from firebase (cough cough)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too Many requests, please try again later'
});

app.use(limiter);

DiscordRPC.register(clientID);

app.use(express.json());

const server = app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

//when the request is received from the frontend it goes here v
app.post('/update-rpc', async (req, res) => {
    const {title, diff ,url} = req.body;
    console.log('Received Data: ', {title, diff, url});
    
    try
    {
        await setActivity(title, diff, url);
        res.status(200).send({message: 'RPC Updated Successfully'});
    }
    catch (err)
    {
        console.error('Error setting activity: ', err);
        res.status(500).send({message: 'Error updating RPC'});
    }

});

//deal with closing tab
app.post('/close-rpc', (req, res) => {
    console.log('Closing RPC...');
    RPC.clearActivity()
        .then(() => {
            console.log('RPC closed successfully. ');
            res.status(200).send({message:'RPC closed successfully.'});
        })
        .catch(err =>{
            console.error('Error closing RPC: ', err);
            res.status(500).send({message: 'Error closing RPC.'});
        });
});

//clean shutdown, SIGINT is a signal that is like ctrl + C on a terminal, clears activity and exits out with status 0 to let know, there was a clean shutdown
process.on('SIGINT', async () => {
    console.log('Recieved SIGINT. CLosing server...');
    await RPC.clearActivity();
    server.close(() => {
        console.log('Server Closed');
        process.exit(0);
    });
});


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

