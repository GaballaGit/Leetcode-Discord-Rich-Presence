//Because discord requires ICP with its nodejs module (I think?). I split this part into the backend.

const clientID = '1287257520217526395';
const DiscordRPC = require('discord-rpc');
const RPC = new DiscordRPC.Client({ transport : 'ipc' });

DiscordRPC.register(clientID);

async function setActivity() {
    if (!RPC) return;
    RPC.setActivity({
        details: 'Testing discord presence',
        state: 'Playing around with RPC',
        startTimestamp: Date.now(),
        largeImageKey: 'leetcode-icon',
        largeImageText: 'Leetcode',
        //smallImageKey: '',
        //smallImageText: '',
        instance: false,
        buttons: [
            {
                label: 'Check out problem',
                url: 'https://leetcode.com/problems/two-sum/description/'
            }
        ]
    });
};

RPC.on('ready', async () => {
    setActivity();
});

RPC.login({cloientId : clientID}).catch(err => console.error(err));