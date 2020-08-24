const boom = require('boom')
// const fx = require('money');
const Trans =  require('../models/Transactions')
const nodemailer = require("nodemailer");

// Capitalize function
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

exports.createTransaction = async (req, reply) => {
    try {
        const transaction = new Trans(req.body)
                    let email = req.body.email
                    const smtpTransport = nodemailer.createTransport({
                        host: 'smtp.zoho.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'contact@useshukran.com',
                            pass: 'Password2020'
                        }
                      });
                   const mailOptions = {
                       from: "Ola from Shukran <contact@useshukran.com>",
                       to: email,
                       subject: "You just got tipped " + req.body.username.capitalize(),
                       generateTextFromHTML: true,
                       html: "<h2>Hi <b>"+ req.body.username.capitalize() + ",</b></h2>"
                       + req.body.supporter_nickname + " just tipped you!" + "<br>"
                       + "<a href='https://useshukran.com/accounts'>Login to find out how much.</a>"
                       };

                    smtpTransport.sendMail(mailOptions, (error, response) => {
                        error ? console.log(error) : console.log(response);
                        smtpTransport.close();
                    });
                   return transaction.save() 
         
    } catch (err) {
      throw boom.boomify(err)
    }
}

exports.requestPayout = async (req, reply) => {
    try {
        const transaction = new Trans(req.body)
                    let email = req.body.email
                    const smtpTransport = nodemailer.createTransport({
                        host: 'smtp.zoho.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'contact@useshukran.com',
                            pass: 'Password2020'
                        }
                      });
                   const mailOptions = {
                       from: "Ola from Shukran <contact@useshukran.com>",
                       to: 'olamide@useshukran.com',
                       subject: "Payout request by " + req.body.username.capitalize(),
                       generateTextFromHTML: true,
                       html: "<h2>Hey, <b>"+ req.body.username.capitalize() + "<"+email+"> just requested a payout of ₦"+req.body.amount+"</b></h2>"
                       + "So just pay ₦"+req.body.amount+" .Please attend to it! Thanks"
                       };

                    smtpTransport.sendMail(mailOptions, (error, response) => {
                        error ? console.log(error) : console.log(response);
                        smtpTransport.close();
                    });
                   return transaction.save() 
         
    } catch (err) {
      throw boom.boomify(err)
    }
}

exports.AllTransactions = async (req, reply) => {
    try {
        var trans = Trans.find()
        return trans
    } catch (error) { 
        throw boom.boomify(error)
    }
}
exports.findRequested = async (req, reply) => {
    try {
        var status = req.body.status
        var trans = Trans.find({'status': status})
        return trans  
    } catch (err) {
      throw boom.boomify(err)
    }
}
exports.findAllMyTransaction = async (req, reply) => {
    try {
        var username = req.body.username
        var status = req.body.status
        var trans = Trans.find({
            $and: [
                {'username': username, 'status': status}
            ]
        })
        return trans  
    } catch (err) {
      throw boom.boomify(err)
    }
},
exports.findOneTransaction = async (req, reply) => {
    try {
        var id = req.body.id
        var mydocu = Trans.findById(id)
        return mydocu
    } catch(err) {
        throw  boom.boomify(err)
    }
}
exports.deleteTransaction = async (req, reply) => {
    try {
        var id = req.body.id
        var transaction = await Trans.findByIdAndRemove(id)
        return transaction
    } catch(err) {
        throw  boom.boomify(err)
    }
}
exports.updateTransaction = async (req, reply) => {
    try {
      const id = req.body.id
      const transaction = req.body
      const { ...updateData } = transaction
      const update = await Trans.findByIdAndUpdate(id, updateData, { new: true })
      return update
    } catch (err) {
      throw boom.boomify(err)
    }
}