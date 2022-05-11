// make request to https://www.instagram.com/{username}/?__a=1
// get id from that 

// make request to https://i.instagram.com/api/v1/users/{id}/info/
// get public_email
// BANG!!!

// const emailsToFind = ['Viologram', 'programmer.me', 'wealth'] // Instagram Usernames
let emailsToFind = [] // Instagram Usernames

let count = 0
let emailsFound = []

async function getEmail(username)
{
    // puppeteer-extra is a drop-in replacement for puppeteer,
    // it augments the installed puppeteer with plugin functionality

    console.time('Time Taken')
    console.log('')

    const timeout = 500

    const puppeteer = require('puppeteer')

    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: "./user_data",
        rgs: ['--window-size=1920,1080']
        // args: ['--proxy-server=91.243.35.254:80']
    })

    async function getID(username)
    {
        const link = "https://www.instagram.com/"+username+"/?__a=1"
        // link = 'https://google.com/'
    
    
        const page = await browser.newPage();
        
        // minimizes
        const session = await page.target().createCDPSession();
        const {windowId} = await session.send('Browser.getWindowForTarget');
        await session.send('Browser.setWindowBounds', {windowId, bounds: {windowState: 'minimized'}});

        page.goto(link)
        page.on('response', async response => {
            // const data = await response.buffer()
            await page.waitForTimeout(timeout)
            // await page.screenshot({ path: 'testresult.png', fullPage: false })
            const data = await page.evaluate(() => document.querySelector('*').outerHTML);
            
            const userId = ((data.split('profilePage_')[1]).split('show')[0]).split('"')[0]
            // console.log(userId)
            // await browser.close()
            await getEmailFromId(userId)
        })
    }

    async function getEmailFromId(id)
    {
        const link = "https://i.instagram.com/api/v1/users/"+id+"/info/"

        const SecondPage = await browser.newPage();

        // minimizes
        const session = await SecondPage.target().createCDPSession();
        const {windowId} = await session.send('Browser.getWindowForTarget');
        await session.send('Browser.setWindowBounds', {windowId, bounds: {windowState: 'minimized'}});

        await SecondPage.setUserAgent('Instagram 219.0.0.12.117 Android');
    
        SecondPage.goto(link)
        SecondPage.on('response', async response => {
            // await SecondPage.screenshot({ path: 'testresult.png', fullPage: false })
            await SecondPage.waitForTimeout(timeout)
            const data = await SecondPage.evaluate(() => document.querySelector('*').outerHTML);
            
            let email = ''
            try{
                email = (data.split('public_email":"')[1]).split('","public_phone')[0]
            }catch{}
            if(email)
            {
                console.log(email)
            }else{
                console.log('Not a business account, No email')
            }
            console.timeEnd('Time Taken')
            await browser.close()

            // return email
            count ++
            emailsFound.push(email)
            if(count < emailsToFind.length)
            {
                getEmail(emailsToFind[count]) // next email
                
            }else {onFinish()}

            // const data = await response.buffer()
        })
    }


    getID(username)

}

async function getEmailAndId(UsersList)
{
    
    const timeout = 1000
    
    const puppeteer = require('puppeteer')
    
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: "./user_data",
        rgs: ['--window-size=1920,1080']
        // args: ['--proxy-server=91.243.35.254:80']
    })
    console.time('Total Time')
    for (var x = 0; x < UsersList.length; x++)
    {
        console.time('Time Taken')
        console.log('')
        const link = "https://www.instagram.com/"+UsersList[x]+"/?__a=1"
        // link = 'https://google.com/'
    
        const page = await browser.newPage();
        
        // minimizes
        let session = await page.target().createCDPSession();
        var {windowId} = await session.send('Browser.getWindowForTarget');
        await session.send('Browser.setWindowBounds', {windowId, bounds: {windowState: 'minimized'}});

        page.goto(link)

        const data = await page.waitForResponse(link);
        let d = await data.json()
        const userId = d.graphql.user.id
        console.log(userId)

        const link2 = "https://i.instagram.com/api/v1/users/"+userId+"/info/"
        // link = 'https://google.com/'
    
        const page2 = await browser.newPage();
        await page2.setUserAgent('Instagram 219.0.0.12.117 Android');
        
        // minimizes
        session = await page2.target().createCDPSession();
        var {windowId} = await session.send('Browser.getWindowForTarget');
        await session.send('Browser.setWindowBounds', {windowId, bounds: {windowState: 'minimized'}});

        page2.goto(link2)

        const data2 = await page2.waitForResponse(link2);
        let d2 = await data2.json()

        const Email = d2.user.public_email
        console.log(Email)

        if(Email)
        {
            emailsFound.push(Email)
        }

        page.close()
        page2.close()
        console.timeEnd('Time Taken')
    }
    await browser.close()
    console.timeEnd('Total Time')

    sendMsg(['Done!', emailsFound, emailsToFind])
}

async function getAccountsFromHashtag(hashtag)
{
    const timeout = 500

    const puppeteer = require('puppeteer')

    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: "./user_data",
        // args: ['--proxy-server=91.243.35.254:80']
    })

    const link = 'https://www.instagram.com/explore/tags/'+hashtag+'/?__a=1'
    // link = 'https://google.com/'


    const page = await browser.newPage();
    
    // minimizes
    const session = await page.target().createCDPSession();
    const {windowId} = await session.send('Browser.getWindowForTarget');
    await session.send('Browser.setWindowBounds', {windowId, bounds: {windowState: 'minimized'}});

    page.goto(link)
    page.on('response', async response => {
        // const data = await response.buffer()
        console.log('responed')
        await page.waitForTimeout(timeout)
        // await page.screenshot({ path: 'testresult.png', fullPage: false })
        let data = await page.evaluate(() => document.querySelector('*').outerHTML);
        
        await browser.close()

        let namesList = []

        // console.log((data.split('username')[1+1]).split('full_name')[0])
        // console.log((data.split('username')[2+1]).split('full_name')[0])
        // console.log((data.split('username')[3+1]).split('full_name')[0])
        // console.log((data.split('username')[4+1]).split('full_name')[0])

        console.log(data)
        for(var i = 0; i < 100; i++) {
            var n = (data.split('username":"')[i+1]).split('","full_name')[0]
            // console.log(data)
            
            if(!namesList.includes(n))
            {
                // console.log(n)
                namesList.push(n)
            }
        }

        console.log(namesList)

        emailsToFind = namesList

        // getEmail(emailsToFind[0])

        sendMsg(['time', Math.ceil((2.3*emailsToFind.length) + 5)])

        getEmailAndId(emailsToFind)

        
    })
}

// getAccountsFromHashtag('summer')

// getEmailAndId(['Viologram', 'Viologram', 'Viologram', 'Viologram', 'Viologram', 'Viologram', 'Viologram', 'Viologram', 'Viologram', 'Viologram'])

function startProcess(hashtag)
{
    console.log('Starting process! ')

    // emailsToFind = usernamesList

    // find all usernames releated to a hashtag

    // getEmail(emailsToFind[0])
    getAccountsFromHashtag(hashtag)
}

function onFinish()
{
    console.log('')
    console.log(emailsFound)

    sendMsg(emailsFound)
}


const {app, BrowserWindow, ipcMain} = require('electron')

let myWindow = {};

app.whenReady().then(() => {
    myWindow = new BrowserWindow({
        width: 1400,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        title: 'Instagram Hashtag Tool'
    })

    myWindow.setAlwaysOnTop(true, 'screen');
    // load webpage

    myWindow.loadFile('index.html')
})

ipcMain.on('asynchronous-message', (event, arg) => {
    if(arg[0] == 'startProc')
    {
        startProcess(arg[1])
    }
})

function sendMsg(msg)
{
    myWindow.webContents.send('asynchronous-reply', msg);
}