const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "form@gursoynakliyat.com", // generated ethereal user
        pass: "pytvy9-Xygxim-gepcav", // generated ethereal password
    },
});

app.use(express.json())



app.use(cors())

app.get("/", (req, res) => {
    res.send("Gursoy Api")
})

app.get("/mercedes", (req, res) => {
    res.send("OK")
})

app.get("/:id", cors(), async (req, res) => {
    const gonderiID = req.params.id;
    const { Client } = require('@notionhq/client');
    const notion = new Client({ auth: "secret_b9HVesSW7nwXCjJFNUXdzX4rVGL3ElCrlQYqkb9j7sY" });

    (async () => {
        const databaseId = 'ce99cf141fae413282d395a1a136f7e2';
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                "property": "Taşıma Numarası",
                "formula": {
                    "string": {
                        "equals": gonderiID
                    }
                }
            }
        });
        try {
            const data = response.results[0].properties;
            var veri = {
                statu: data.Statü.status.name,
                siparisTarihi: data["Sipariş Tarihi"].date.start,
                tahminiTeslim: data.UYT.date.start,
                surucu: data.Sürücü.multi_select[0].name,
                cekiciPlaka: data["Çekici"]["multi_select"][0]["name"],
                dorsePlaka: data.Dorse.multi_select[0].name,
                yuklemeUlkesi: data["Yükleme Ülkesi"]["multi_select"][0]["name"],
                teslimUlkesi: data["Teslim Ülkesi"]["multi_select"][0]["name"],
            }
            console.log(veri);
            //! 2. BOLUM 
            const notion2 = new Client({ auth: "secret_b9HVesSW7nwXCjJFNUXdzX4rVGL3ElCrlQYqkb9j7sY" });
            const databaseId2 = '6f4e6983551a4e70a8fadbb1f6cb0e49';
            const response2 = await notion2.databases.query({
                database_id: databaseId2,
                filter: {
                    "property": "Kullanıcı",
                    "title": {
                        "equals": veri.dorsePlaka
                    }
                }
            });
            if (veri.statu == "Sipariş" || veri.statu == "Tamamlandı" || veri.statu == "Teslim Edildi" || veri.statu == "Done") {
                return res.status(200).send(veri);
            }
            const cihazid = response2.results[0].properties["Cihaz ID"].rich_text[0].plain_text;
            //! 3. BOLUM
            const url = "http://ws.arvento.com/v1/report.asmx/GetVehicleStatusJSON?Username=gursoynakliyat&PIN1=vesdop-2dirkE-rybnim&PIN2=vesdop-2dirkE-rybnim&callBack=string"
            var request = http.get(url, function (response) {
                // data is streamed in chunks from the server
                // so we have to handle the "data" event    
                var buffer = "";
                response.on("data", function (chunk) {
                    buffer += chunk;
                });
                response.on("end", async function (err) {
                    buffer = buffer.slice(7, -2);
                    const konumlar = JSON.parse(buffer);
                    await konumlar.find(car => car.Node == cihazid ? veri["address"] = car.Address : "");
                    return res.send(veri);
                });
            });
        } catch (err) {
            res.status(404).send(err)
        }
    })();
})

app.post("/mailgonder", async (req, res) => {


    try {
        //? Kullanıcıya Gonderilen
        await transporter.sendMail({
            from: 'form@gursoynakliyat.com', // sender address
            to: req.body.email, // list of receivers
            subject: "Order is proccesing / Siparişiniz işleniyor", // Subject line
            html: `<table id="u_body"
    style="border-collapse:collapse;table-layout:fixed;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0;vertical-align:top;min-width:320px;Margin:0 auto;background-color:#fff;width:100%"
    cellpadding="0" cellspacing="0">
    <tbody>
        <tr style="vertical-align:top">
            <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
                <div class="u-row-container" style="padding:0;background-color:#fff">
                    <div class="u-row"
                        style="Margin:0 auto;min-width:320px;max-width:620px;overflow-wrap:break-word;word-wrap:break-word;word-break:break-word;background-color:#fff">
                        <div
                            style="border-collapse:collapse;display:table;width:100%;height:100%;background-color:transparent">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px;"><tr style="background-color: #ffffff;"><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="620" style="background-color: #ffffff;width: 620px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                            <div class="u-col u-col-100"
                                style="max-width:320px;min-width:620px;display:table-cell;vertical-align:top">
                                <div style="background-color:#fff;height:100%;width:100%!important">
                                    <!--[if (!mso)&(!IE)]><!-->
                                    <div
                                        style="height:100%;padding:0;border-top:0 solid transparent;border-left:0 solid transparent;border-right:0 solid transparent;border-bottom:0 solid transparent">
                                        <!--<![endif]-->
                                        <table style="font-family:arial,helvetica,sans-serif" role="presentation"
                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                            <tbody>
                                                <tr>
                                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif"
                                                        align="left">
                                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="padding-right:0;padding-left:0"
                                                                        align="center"> <img align="center" border="0"
                                                                            src="http://gursoynakliyat.com.tr/images/maillogo.png"
                                                                            alt="Image" title="Image"
                                                                            style="outline:0;text-decoration:none;-ms-interpolation-mode:bicubic;clear:both;display:inline-block!important;border:none;height:auto;float:none;width:28%;max-width:168px"
                                                                            width="168"> </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <!--[if (!mso)&(!IE)]><!-->
                                    </div>
                                    <!--<![endif]-->
                                </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                    </div>
                </div>
                <div class="u-row-container" style="padding:0;background-color:#fff">
                    <div class="u-row"
                        style="Margin:0 auto;min-width:320px;max-width:620px;overflow-wrap:break-word;word-wrap:break-word;word-break:break-word;background-color:#fff">
                        <div
                            style="border-collapse:collapse;display:table;width:100%;height:100%;background-color:transparent">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px;"><tr style="background-color: #ffffff;"><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="620" style="width: 620px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                            <div class="u-col u-col-100"
                                style="max-width:320px;min-width:620px;display:table-cell;vertical-align:top">
                                <div style="height:100%;width:100%!important">
                                    <!--[if (!mso)&(!IE)]><!-->
                                    <div
                                        style="height:100%;padding:0;border-top:0 solid transparent;border-left:0 solid transparent;border-right:0 solid transparent;border-bottom:0 solid transparent">
                                        <!--<![endif]-->
                                        <table style="font-family:arial,helvetica,sans-serif" role="presentation"
                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                            <tbody>
                                                <tr>
                                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif"
                                                        align="left">
                                                        <div
                                                            style="line-height:140%;text-align:center;word-wrap:break-word">
                                                            <p
                                                                style="font-size:14px;line-height:140%;text-align:center">
                                                                <span
                                                                    style="font-size:24px;line-height:33.599999999999994px"><strong><span
                                                                            style="line-height:33.599999999999994px;font-size:24px"><span style="color:#6e757c;"> Order is proccesing  </span> / Siparişiniz işleniyor</span></strong></span></p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table style="font-family:arial,helvetica,sans-serif" role="presentation"
                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                            <tbody>
                                                <tr>
                                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif"
                                                        align="left">
                                                        <div
                                                            style="color:#9c9c94;line-height:140%;text-align:center;word-wrap:break-word">
                                                            <p
                                                                style="font-size:14px;line-height:140%;text-align:center">
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <!--[if (!mso)&(!IE)]><!-->
                                    </div>
                                    <!--<![endif]-->
                                </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                    </div>
                </div>
                <div class="u-row-container" style="padding:0;background-color:#fff">
                    <div class="u-row"
                        style="Margin:0 auto;min-width:320px;max-width:620px;overflow-wrap:break-word;word-wrap:break-word;word-break:break-word;background-color:#fff">
                        <div
                            style="border-collapse:collapse;display:table;width:100%;height:100%;background-color:transparent">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px;"><tr style="background-color: #ffffff;"><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="620" style="width: 620px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                            <div class="u-col u-col-100"
                                style="max-width:320px;min-width:620px;display:table-cell;vertical-align:top">
                                <div style="height:100%;width:100%!important">
                                    <!--[if (!mso)&(!IE)]><!-->
                                    <div
                                        style="height:100%;padding:0;border-top:0 solid transparent;border-left:0 solid transparent;border-right:0 solid transparent;border-bottom:0 solid transparent">
                                        <!--<![endif]-->
                                        <table style="font-family:arial,helvetica,sans-serif" role="presentation"
                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                            <tbody>
                                                <tr>
                                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif"
                                                        align="left">
                                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="padding-right:0;padding-left:0"
                                                                        align="center"> <img align="center" border="0"
                                                                            src="http://gursoynakliyat.com.tr/images/mailtruck.png"
                                                                            alt="Image" title="Image"
                                                                            style="outline:0;text-decoration:none;-ms-interpolation-mode:bicubic;clear:both;display:inline-block!important;border:none;height:auto;float:none;width:100%;max-width:600px;border-radius: 15px;"
                                                                            width="600"> </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <!--[if (!mso)&(!IE)]><!-->
                                    </div>
                                    <!--<![endif]-->
                                </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                    </div>
                </div>
                <div class="u-row-container" style="padding:0;background-color:#fff">
                    <div class="u-row"
                        style="Margin:0 auto;min-width:320px;max-width:620px;overflow-wrap:break-word;word-wrap:break-word;word-break:break-word;background-color:#fff">
                        <div
                            style="border-collapse:collapse;display:table;width:100%;height:100%;background-color:transparent">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px;"><tr style="background-color: #ffffff;"><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="620" style="width: 620px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                            <div class="u-col u-col-100"
                                style="max-width:320px;min-width:620px;display:table-cell;vertical-align:top">
                                <div style="height:100%;width:100%!important">
                                    <!--[if (!mso)&(!IE)]><!-->
                                    <div
                                        style="height:100%;padding:0;border-top:0 solid transparent;border-left:0 solid transparent;border-right:0 solid transparent;border-bottom:0 solid transparent">
                                        <!--<![endif]-->
                                        <table style="font-family:arial,helvetica,sans-serif" role="presentation"
                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                            <tbody>
                                                <tr>
                                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif"
                                                        align="left">
                                                        <div
                                                            style="line-height:140%;text-align:center;word-wrap:break-word">
                                                            <p style="font-size:14px;line-height:140%;text-align:left">
                                                                <strong><span style="color:#6e757c;"> Dear / </span> Merhaba</strong></p>
                                                            <p style="font-size:14px;line-height:140%;text-align:left"> 
                                                            </p>
                                                            <p style="line-height:140%;text-align:left;font-size:14px">
                                                                <strong> <span style="color:#6e757c;"> We are processing your order.Wi will be back as soon as possible. / </span> Siparişinizi aldık. En kısa sürede geri dönüş yapacağız.</strong>
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <!-- <table style="font-family:arial,helvetica,sans-serif" role="presentation"
                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                            <tbody>
                                                <tr>
                                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif"
                                                        align="left">
                                                        <div
                                                            style="line-height:140%;text-align:center;word-wrap:break-word">
                                                            <p style="font-size:14px;line-height:140%"> </p>
                                                            <ul>
                                                                <li
                                                                    style="font-size:14px;line-height:19.599999999999998px;text-align:left">
                                                                    <span
                                                                        style="font-size:14px;line-height:19.599999999999998px"><strong>DE-21</strong></span> 'da
                                                                    Double-Deck Frigo / Yüklemeye hazır</li>
                                                                <li
                                                                    style="font-size:14px;line-height:19.599999999999998px;text-align:left">
                                                                    <strong><span
                                                                            style="color:#3598db;font-size:14px;line-height:19.6px">DE-84</span></strong>
                                                                    'da Double-Deck Frigo / Yüklemeye hazır</li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table> -->
                                        <!-- <table style="font-family:arial,helvetica,sans-serif" role="presentation"
                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                            <tbody>
                                                <tr>
                                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif"
                                                        align="left">
                                                        <div
                                                            style="line-height:140%;text-align:center;word-wrap:break-word">
                                                            <p style="font-size:14px;line-height:140%;text-align:left">
                                                                <strong>Teslim yeri: Türkiye, Azerbaycan, Gürcistan,
                                                                    Iran ve Ermenistan</strong></p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table> -->
                                        <!--[if (!mso)&(!IE)]><!-->
                                    </div>
                                    <!--<![endif]-->
                                </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                    </div>
                </div>
                <div class="u-row-container" style="padding:0;background-color:transparent">
                    <div class="u-row"
                        style="Margin:0 auto;min-width:320px;max-width:620px;overflow-wrap:break-word;word-wrap:break-word;word-break:break-word;background-color:transparent">
                        <div
                            style="border-collapse:collapse;display:table;width:100%;height:100%;background-color:transparent">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px;"><tr style="background-color: transparent;"><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="620" style="width: 620px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                            <div class="u-col u-col-100"
                                style="max-width:320px;min-width:620px;display:table-cell;vertical-align:top">
                                <div style="height:100%;width:100%!important">
                                    <!--[if (!mso)&(!IE)]><!-->
                                    <div
                                        style="height:100%;padding:0;border-top:0 solid transparent;border-left:0 solid transparent;border-right:0 solid transparent;border-bottom:0 solid transparent">
                                        <!--<![endif]-->
                                        <table style="font-family:arial,helvetica,sans-serif" role="presentation"
                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                            <tbody>
                                                <tr>
                                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif"
                                                        align="left">
                                                        <!--[if mso]><style>.v-button {background: transparent !important;}</bstyle><![endif]-->
                                                        <div align="center">
                                                            <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="mailto:satis@gursoynakliyat.com?subject=Y%C3%BCkleme%20Talebi&body=" style="height:36px; v-text-anchor:middle; width:132px;" arcsize="11%" stroke="f" fillcolor="#359ff3"><w:anchorlock/><center style="color:#FFFFFF;font-family:arial,helvetica,sans-serif;"><![endif]-->
                                                            <a href="mailto:satis@gursoynakliyat.com?subject=Details/Detaylar&body="
                                                                target="_blank" class="v-button"
                                                                style="box-sizing:border-box;display:inline-block;font-family:arial,helvetica,sans-serif;text-decoration:none;-webkit-text-size-adjust:none;text-align:center;color:#fff;background-color:#359ff3;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto;max-width:100%;overflow-wrap:break-word;word-break:break-word;word-wrap:break-word;mso-border-alt:none">
                                                                <span
                                                                    style="display:block;padding:10px 20px;line-height:120%"><span
                                                                        style="font-size:14px;line-height:16.8px">Contact Us</span></span> </a>
                                                            <!--[if mso]></center></v:roundrect><![endif]-->
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <!--[if (!mso)&(!IE)]><!-->
                                    </div>
                                    <!--<![endif]-->
                                </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                    </div>
                </div>
                <div class="u-row-container" style="padding:20px 0 0;background-color:#fff">
                    <div class="u-row"
                        style="Margin:0 auto;min-width:320px;max-width:620px;overflow-wrap:break-word;word-wrap:break-word;word-break:break-word;background-color:#1888e4">
                        <div
                            style="border-collapse:collapse;display:table;width:100%;height:100%;background-color:transparent">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 20px 0px 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px;"><tr style="background-color: #1888e4;"><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="620" style="width: 620px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                            <div class="u-col u-col-100"
                                style="max-width:320px;min-width:620px;display:table-cell;vertical-align:top">
                                <div style="height:100%;width:100%!important">
                                    <!--[if (!mso)&(!IE)]><!-->
                                    <div
                                        style="height:100%;padding:0;border-top:0 solid transparent;border-left:0 solid transparent;border-right:0 solid transparent;border-bottom:0 solid transparent">
                                        <!--<![endif]-->
                                        <table style="font-family:arial,helvetica,sans-serif" role="presentation"
                                            cellpadding="0" cellspacing="0" width="100%" border="0">
                                            <tbody>
                                                <tr>
                                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:arial,helvetica,sans-serif"
                                                        align="left">
                                                        <div
                                                            style="color:#fff;line-height:200%;text-align:left;word-wrap:break-word">
                                                            <p
                                                                style="font-size:14px;line-height:200%;text-align:center">
                                                                Copyright © 2022. All rights are reserved.<br>Gürsoy
                                                                Nakliyat Tur. İnş. Taah. ve Tic. Ltd. Şti. - Kurna Yolu
                                                                Caddesi 33, TR-34956</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <!--[if (!mso)&(!IE)]><!-->
                                    </div>
                                    <!--<![endif]-->
                                </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                        </div>
                    </div>
                </div>
                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
            </td>
        </tr>
    </tbody>
    </table>`,
        });

        //? Admine Giden
        await transporter.sendMail({
            from: 'form@gursoynakliyat.com', // sender address
            to: "info@gursoynakliyat.com", // list of receivers
            subject: "Sipariş ", // Subject line
            html: `
    <h2>Sipariş İstek</h2>
    <ul>
      <li>Yukleme Ulkesi : ${req.body.yuklemeulkesi}</li>
      <li>Boşaltma Ülkesi : ${req.body.bosaltmaulkesi}</li>
      <li>${req.body.isim}</li>
      <li>${req.body.email}</li>
      <li>${req.body.telefon}</li>
      <li>${req.body.yuklemetarihi}</li>
      <li>${req.body.konu}</li>
    </ul>  
    `

        })
    } catch (err) {
        req.send(err)
    }

    res.send("mail gonderildi")

})



app.listen(process.env.PORT || 3005, () => {
    console.log("3005 port listening");
})
