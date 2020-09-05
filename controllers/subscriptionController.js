const boom = require('boom')
const https = require('https');
const Subscription = require('../models/Subscription')
const Money = require('../models/Money')

/**
 * when creating a subscription, who is this person deciding to subscribe to?
 */
exports.createSubscription = async (req, reply) => { // https://attacomsian.com/blog/node-make-http-requests
    try { // https://stackoverflow.com/a/40539133/9259701

        // before we create a new subscription, let's check if we have a subscritpion with that amount before

        return new Promise((resolve, reject) => { // https://stackoverflow.com/a/59274104/9259701

            /**
             * expect requestData to look like:
             * {
             * "amount": parseInt(this.amount),
                supporter_email: this.email,
                creator: this.username,
                creator_id: this.userinfos[0]._id,
                "name": `${this.supporter_email}-shukraning-NGN${this.userinfos[0]._id}`
                },
             */
            let requestData = req.body

            let options = {
                hostname: 'api.flutterwave.com', // don't add protocol
                port: 443, // optional
                path: '/v3/payment-plans',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.FLUTTERWAVE_SEC_KEY}`
                }
            };
    
            const data = JSON.stringify({
                "amount": parseInt(requestData.amount),
                "name": requestData.name,
                "interval": "monthly", // daily
                "duration": 12
            });

            // make use of the subscirption creation date to know when the person started paying, and most importantly who they're paying to!
    
            const request = https.request(options, (resp) => {
                let respData = '';
    
                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    respData += chunk;
                });
    
                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    let endData = JSON.parse(respData)
                    // console.log(endData);
                    // add creator, supporter_email
                    endData.data.creator = respData.creator
                    endData.data.supporter_email = respData.supporter_email
                    const subscription = new Subscription(endData.data)
                    subscription.save()

                    resolve(endData.data.id); // we only need to return the id
                });
    
            }).on("error", (err) => {
                console.log("Error: ", err.message);
                // return err
                reject(err.message);
            });
            request.write(data);
            request.end();
        })

    } catch (err) {
      throw boom.boomify(err)
    }
}
exports.getAllSubscriptions = async (req, reply) => {
    try {
        return new Promise((resolve, reject) => { // https://stackoverflow.com/a/59274104/9259701

            let options = {
                hostname: 'api.flutterwave.com', // don't add protocol
                port: 443, // optional
                path: '/v3/payment-plans',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.FLUTTERWAVE_SEC_KEY}`
                }
            };
    
            https.request(options, (resp) => {
                let getData = ''; // very important to initialize
    
                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    getData += chunk;
                });
    
                // The whole response has been received.
                resp.on('end', () => {
                    resolve(JSON.parse(getData));
                });
    
            }).on("error", (err) => {
                console.log("Error: ", err.message);
                // return err
                reject(err.message);
            }).end();
        })
    } catch (err) {
        throw boom.boomify(err)
    }
}
/**
 * 
 * @param {*} req 
 * @param {*} reply 
 * get details of all the subscribers of a creator
 */
exports.getSubscribers = async (req, reply) => {
try { // https://stackoverflow.com/a/40539133/9259701
    // do a script that'll regularly update out db
/*         let page_number = 1;
        let endData = [];
        fetchSubs = () => {
            return new Promise((resolve, reject) => { // https://stackoverflow.com/a/59274104/9259701
                
                let options = { // https://nodejs.org/api/http.html#http_http_request_url_options_callback
                    hostname: 'api.flutterwave.com', // don't add protocol
                    port: 443, // optional
                    path: `/v3/payment-plans?page=${page_number}`,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.FLUTTERWAVE_SEC_KEY}`
                    }
                };
        
                
                //  reading through https://developer.flutterwave.com/reference#get-payment-plans
                //  we'd need to get all the pages before sending to the front end
                //  so we'll have to make the calls recurringly until current_page === total_pages
                //  but for now, we don't have more/up to 10 subscribers
                https.request(options, (resp) => {
                    let getData = ''; // very important to initialize
                    
                    // A chunk of data has been recieved.
                    resp.on('data', (chunk) => {
                        getData += chunk;
                    });
        
                    // The whole response has been received.
                    resp.on('end', () => {
                        let response = JSON.parse(getData)
                        console.log('\ndone with \n',resp.url,'\n', response)
                        //  {meta: { page_info: { total: 11, current_page: 1, total_pages: 2 }
                        if (response.status === "success" && response.meta.page_info.current_page < response.meta.page_info.total_pages) {
                            console.log('subs ss s\n', response)
                            endData.push(response.data)
                            page_number++
                            console.info('\nwe\'re going again', page_number)
                            fetchSubs();
                            
                        } else if (response.status === "success" && response.meta.page_info.current_page === response.meta.page_info.total_pages) {

                            // push last bit
                            endData.push(response.data)
                            // let's test
                            // endData = endData.filter(sub => sub.name.includes(req.query.id))
                            console.log('\nwe\'re done\n', endData)
                            resolve(endData);
                        } else {
                            console.error('\nwe\'re NOT done\n')
                            reject('failed')
                        }
                        // resolve(response)
                    });
        
                }).on("error", (err) => {
                    console.log("Error: ", err, err.message);
                    // return err
                    reject(err.message);
                }).end();
            })
        }

        fetchSubs();
 */

    // before we create a new subscription, let's check if we have a subscritpion with that amount before
    






    
    // not req.query.username use req.query.id in prod

    





    
    
    // https://stackoverflow.com/a/13437802/9259701
    // also check if their subscription is still active
    let subs = Subscription.find({
        'name': new RegExp(`-shukraning-${/* req.query.username */req.query.id}`, 'gi'),
        status: 'active'
    }, { plan_token: 0, id: 0, _id: 0, __v: 0 }) // exclude these fields
    
    return subs

} catch (err) {
  throw boom.boomify(err)
}
}

exports.createCreatorFolder = async (req, reply) => {
    // check if they already have a folder id
    // fetch ID of creator, get folder_id

        var fileMetadata = {
            'name': `${req.body.creator_id}-stuff`,
            'mimeType': 'application/vnd.google-apps.folder',
            'parents' : ['1J6ALbTDRqytQKRE7G1MD0JgS9MW3ib31'] // folder 'shukran-contents'
            };
            drive.files.create({
            resource: fileMetadata,
            fields: 'id'
            }, function (err, file) {
            if (err) {
                // Handle error
                console.error(err);
            } else {
                console.log('Folder Id: ', file.id);
            }
        });
    
}

exports.uploadInCreatorFolder = async (req, reply) => {
    // check if the creator already has a folder
    this.createCreatorFolder(req);
    let fileMetadata = {
        'name': filename, // Date.now() + '.jpg',
        parents: ['1J6ALbTDRqytQKRE7G1MD0JgS9MW3ib31'] // upload to folder shukran-contents
    };
    let media = {
        mimeType: mimetype,
        body: filestream
    };

    let g = await ggle.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
    });
    if (g.data.id) {
        updateData['picture_id'] = g.data.id
        update = await User.findByIdAndUpdate(updateData['id'], updateData, { new: true })
        console.info('political g.data.webViewLink', g.data.webViewLink)
        reply.code(200).send(g.data.id)
    } else {
        throw new Error(`upload error! status: ${g.status}`);
    }
}