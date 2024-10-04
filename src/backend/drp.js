//Because discord requires ICP with its nodejs module (I think?). I split this part into the backend.
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;


const clientID = '1287257520217526395';
const DiscordRPC = require('discord-rpc');
const RPC = new DiscordRPC.Client({ transport : 'ipc' });

//using cors to do stuff with leetcode info
app.use(cors({
    origin: 'https://leetcode.com',
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: 'Content-Type',
    credentials: true
}));

DiscordRPC.register(clientID);

app.use(express.json());

//when the request is recieved from the frontend it goes here v
app.post('/update-rpc', (req, res) => {
    const {title, url} = req.body;
    console.log('Recieved Data: ', {title, url});

    setActivity(title, url);

    res.status(200).send({message: 'RPC Updated Sucessfully'});
})

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

//Set discord activity
async function setActivity(title, url) {
    if (!RPC) return;
    RPC.setActivity({
        details: `${title}`,
        //state: 'Playing around with RPC',
        startTimestamp: Date.now(),
        largeImageKey: 'leetcode-icon',
        largeImageText: 'Leetcode',
        //smallImageKey: '',
        //smallImageText: '',
        instance: false,
        buttons: [
            {
                label: 'Check out problem',
                url: `${url}`
            }
        ]
    });
};

//Default
RPC.on('ready', async () => {
    console.log('Discord RPC is Ready!');
    setActivity('Browsing Leetcode', 'https://leetcode.com');
});

RPC.login({clientId : clientID}).catch(err => console.error(err));

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});