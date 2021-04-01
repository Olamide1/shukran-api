const https = require('https');
let fs = require('fs');
let endData = [];
exports.getAllSubscribers = new Promise((resolve, reject) => { // https://stackoverflow.com/a/59274104/9259701
        
        //  reading through https://developer.flutterwave.com/reference#get-payment-plans
        //  we'd need to get all the pages before sending to the front end
        //  so we'll have to make the calls recurringly until current_page === total_pages
        //  but for now, we don't have more/up to 10 subscribers
        let call = (page_number) => https.request({ // https://nodejs.org/api/http.html#http_http_request_url_options_callback
            hostname: 'api.flutterwave.com', // don't add protocol
            port: 443, // optional
            path: `/v3/subscriptions`, // ?&status=active
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer FLWSECK-b93f3a40802ee2c2fa85f83ba38e7bd6-X`
            }
        }, (resp) => {
            let getData = ''; // very important to initialize
            
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                getData += chunk;
            });

            // The whole response has been received.
            resp.on('end', () => {
                let response = JSON.parse(getData)
                // console.log('\ndone with \n', resp.url,'\n', response)
                // {meta: { page_info: { total: 11, current_page: 1, total_pages: 2 }
                if (response.status === "success" && response.meta.page_info.current_page < response.meta.page_info.total_pages) {
                    // console.log('subscribers\n', response)
                    endData = endData.concat(response.data)
                    page_number++
                    // console.info('\nwe\'re going again', page_number)
                    // this.getAllSubscribers();
                    call(page_number); // call again!
                    
                } else if (response.status === "success" && response.meta.page_info.current_page === response.meta.page_info.total_pages) {

                    // add last bit
                    endData = endData.concat(response.data)
                    // let's test
                    // endData = endData.filter(sub => sub.name.includes(req.query.id))
                    // console.log('\nwe\'re done\n', endData)
                    
                    resolve(endData);
                } else {
                    reject('Failed to get all subscribers') // throw new Error('failed') //
                }
            });

        }).on("error", (err) => {
            console.log("Error: ", err, err.message);
            // return err
            reject(err.message);
        }).end();
        call(1);
    })


// getAllSubscribers();