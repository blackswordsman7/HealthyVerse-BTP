'use strict'
const fs = require("fs")
const Logger = use('Logger')
const PdfDocument = require('pdfkit')
const PdfTable = require('voilab-pdf-table')
const sudo = require('sudo-js');


const Env = use('Env')
class PdfService {

  autoDeletePdf(path){
    setTimeout(function(){
        
      sudo.setPassword(Env.get('SUDO_PASSWORD'))
      const command = ['rm', '-rf', "public/temp/"+path];
      sudo.exec(command, function(err, pid, result) {
        if (err) {
          Logger.error(err)
        }

        if (result) {
          Logger.info(result)
        }
      });
      Logger.warning(path + " has been self-removed")
    }, 60000);
  }

  generatePDF(data, name) {

    let filename = "public/temp/" + name + ".pdf"
    try {
      let pass = ""
      if (data.password != undefined) {
        pass = data.password
      }
      // create a PDF from PDFKit, and a table from PDFTable
      var pdf = new PdfDocument({
          autoFirstPage: false,
          userPassword: pass,
          ownerPassword: pass,
          permissions: {
            annotating: true,
            copying: false,
            modifying: false,
            printing: "highResolution"
          }
         
        }),
        table = new PdfTable(pdf, {
          topMargin: 100
        }),
        allergyTable = new PdfTable(pdf, {
          topMargin: 100
        }),
        conditionTable = new PdfTable(pdf, {
          topMargin: 100
        }),
        mediactionTable = new PdfTable(pdf, {
          topMargin: 100
        }),
        patientTable = new PdfTable(pdf, {
          topMargin: 100
        }),
        immunisationTable = new PdfTable(pdf, {
          topMargin: 100
        });
        pdf.pipe(fs.createWriteStream(filename))

      table
        // add some plugins (here, a 'fit-to-width' for a column)
        .addPlugin(new(require('voilab-pdf-table/plugins/fitcolumn'))({
          column: 'value'
        }))
        // set defaults to your columns
        .setColumnsDefaults({
          headerBorder: 'B',
          align: 'justify',
        })
        // add table columns
        .addColumns([{
            id: 'title',
            header: 'SOCIAL HISTORY',
            align: 'left',
            width: 150
          },
          {
            id: 'value',
            header: '',
          }
        ])

        

        patientTable
        // add some plugins (here, a 'fit-to-width' for a column)
        .addPlugin(new(require('voilab-pdf-table/plugins/fitcolumn'))({
          column: 'value'
        }))
        // set defaults to your columns
        .setColumnsDefaults({
          headerBorder: 'B',
          align: 'justify',
        })
        // add table columns
        .addColumns([
          {
            id: 'title',
            header: 'PATIENT INFORMATION',
            align: 'left',
            width: 150,
          },
          {
            id: 'value',
            header: '',
          }
        ])

        mediactionTable
        // add some plugins (here, a 'fit-to-width' for a column)
        .addPlugin(new(require('voilab-pdf-table/plugins/fitcolumn'))({
          column: 'value'
        }))
        // set defaults to your columns
        .setColumnsDefaults({
          headerBorder: 'B',
          align: 'justify',
        })
        // add table columns
        .addColumns([
          {
            id: 'title',
            header: 'MEDICATION PRESCRIPTION',
            align: 'justify',
            width: 150,
          },
          {
            id: 'value',
            header: '',
          }
        ])


        allergyTable
        // add some plugins (here, a 'fit-to-width' for a column)
        .addPlugin(new(require('voilab-pdf-table/plugins/fitcolumn'))({
          column: 'value'
        }))
        // set defaults to your columns
        .setColumnsDefaults({
          headerBorder: 'B',
          align: 'justify',
        })
        // add table columns
        .addColumns([{
            id: 'title',
            header: 'ALLERGIES',
            align: 'left',
            width: 150
          },
          {
            id: 'value',
            header: '',
          }
        ])

        conditionTable
        // add some plugins (here, a 'fit-to-width' for a column)
        .addPlugin(new(require('voilab-pdf-table/plugins/fitcolumn'))({
          column: 'value'
        }))
        // set defaults to your columns
        .setColumnsDefaults({
          headerBorder: 'B',
          align: 'justify',
        })
        // add table columns
        .addColumns([{
            id: 'title',
            header: 'CONDITIONS',
            align: 'left',
            width: 150
          },
          {
            id: 'value',
            header: '',
          }
        ])

        immunisationTable
        // add some plugins (here, a 'fit-to-width' for a column)
        .addPlugin(new(require('voilab-pdf-table/plugins/fitcolumn'))({
          column: 'value'
        }))
        // set defaults to your columns
        .setColumnsDefaults({
          headerBorder: 'B',
          align: 'justify',
        })
        // add table columns
        .addColumns([{
            id: 'title',
            header: 'IMMUNISATIONS',
            align: 'left',
            width: 150
          },
          {
            id: 'value',
            header: '',
          }
        ])


      // if no page already exists in your PDF, do not forget to add one
      pdf.addPage()

      if (data.blockchain) {
        const validation = 6
        const link = "https://rinkeby.etherscan.io/tx/" + data.blockchain.txid
        const walletLink = "https://rinkeby.etherscan.io/tx/" + data.blockchain.address
        const ipfsLink = "https://ipfs.io/ipfs/" + data.blockchain.filehash


        pdf
        .image('public/img/logo.png', 250, 60, {
          align: 'center',
          scale: 0.25
        })
        .moveDown()
        .font('public/fonts/bold.ttf', 25)
        .text('HealthyVerse Passport Certification',{
          align: 'center',
        }, 170, 50)
        .font('public/fonts/roboto.ttf', 13)
        .moveDown()
        .text("HealthyVerse certifies that the atached file identified with hash: ", {
          width: 470,
          align: 'justify',
          indent: 30,
          height: 300,
          ellipsis: true
        })
        .fillColor('blue')
        .font('public/fonts/roboto.ttf', 13)
        .text(data.blockchain.filehash,{
          link: ipfsLink,
          underline: true
        })
        .fillColor('black')
        .font('public/fonts/roboto.ttf', 13)
        .text("saved in block number " + data.blockchain.blockNumber + " of the Ethereum Public Ledger with the following transaction hash: ", {
          width: 470,
          align: 'justify',
          indent: 30,
          height: 300,
          ellipsis: true
        })
        .fillColor('blue')
        .font('public/fonts/roboto.ttf', 13)
        .text(data.blockchain.txid,{
          link,
          underline: true
        })
        .moveDown()
        .fillColor('black')
        .font('public/fonts/roboto.ttf', 13)
        .text( "At this moment the transaction was validated as success by " + validation + " blocks. And for the record, HealthyVerse issues this certificate with date " + this.formatDate(new Date) + ".",{
          width: 470,
          align: 'justify',
          indent: 30,
          height: 300,
          ellipsis: true
        })
        .moveDown()
        .font('public/fonts/bold.ttf', 19)
        .text( "Passport Emitter",{
          width: 470,
          align: 'center',
          indent: 30,
          height: 300,
          ellipsis: true
        })
        .moveDown()
        .font('public/fonts/roboto.ttf', 13)
        .text( "This medical passport has been emitted by " + data.doctor.name + ", " + data.doctor.role + " at the " + data.doctor.clinic + ". This institution is located at " + data.doctor.clinicAddress + " and can be reachable via email ("+data.doctor.email+") or phone ("+data.doctor.phone+"). HealthyVerse certifies that the Declaration Terms represented in the next parargraph have been signed digitally using the following Ethereum wallet: ",{
          width: 470,
          align: 'justify',
          indent: 30,
          height: 300,
          ellipsis: true
        })
        .fillColor('blue')
        .font('public/fonts/roboto.ttf', 13)
        .text(data.blockchain.address,{
          link: walletLink,
          underline: true
        })
        .fillColor('black')
        .font('public/fonts/roboto.ttf', 13)
        .text( " and with the signature hash: ",{
          width: 470,
          align: 'justify',
          indent: 30,
          height: 300,
          ellipsis: true
        })
        .fillColor('blue')
        .font('public/fonts/roboto.ttf', 13)
        .text(data.blockchain.signature,{
          link: "https://etherscan.io/verifySig",
          underline: true
        })
        .moveDown()
        .fillColor('black')
        .font('public/fonts/bold.ttf', 19)
        .text( "Passport Emitter Declaration",{
          width: 470,
          align: 'center',
          indent: 30,
          height: 300,
          ellipsis: true
        })
        .moveDown()
        .font('public/fonts/italic.ttf', 11)
        .text( data.blockchain.message,{
          width: 470,
          align: 'justify',
          indent: 30,
          height: 300,
          ellipsis: true
        })
        .font('public/fonts/italic.ttf', 13)
        .moveDown()
        .addPage()
  
        if (data.image) {
        pdf.image(data.image.tmpPath, {
          align: 'center',
          width: 120,
          height: 120
        })
        pdf.moveDown()
        }

      }


      if (data.image && !data.blockchain) {
        pdf
        .image(data.image.tmpPath, {
          align: 'center',
          width: 120,
          height: 120
        })
        pdf.moveDown()
      }

        patientTable.addBody([
          { 
            title: 'DNA Sequence',
            value: data.patient.dna,
          },
          { 
            title: 'Blood Type',
            value: data.patient.blood,
          },
          { 
          title: 'Full Name',
          value: data.patient.name,
        },
        {
          title: 'DOB',
          value: data.patient.dob,
        },
        {
          title: 'Gender',
          value: data.patient.gender,
        },
        {
          title: '',
          value: '',
        },
      ])

      if (data.report) {        
      data.report.forEach(element => {
        pdf.moveDown()
        conditionTable.addBody([
          {
          title: 'Condition Type',
          value: element.condition
        },
        {
          title: 'Condition Year',
          value: element.year
        },
        {
          title: 'Condition Notes',
          value: element.notes
        },
        {
          title: '',
          value: "",
        }
      ])
      })
    }
      if (data.allergy) {
        data.allergy.forEach(element => {
          pdf.moveDown()
          allergyTable.addBody([
            {
            title: 'Allergy',
            value: element.name
          },
          {
            title: 'High Risk',
            value: element.risk
          },
          {
            title: 'Allergy Notes',
            value: element.notes
          },
          {
            title: '',
            value: "",
          }
        ])
        })
      }

      if (data.immunisation) {
        data.immunisation.forEach(element => {
          pdf.moveDown()
          immunisationTable.addBody([
            {
            title: 'Immunisation',
            value: element.name
          },
          {
            title: 'Year',
            value: element.year
          },
          {
            title: '',
            value: "",
          }
        ])
        })
      }
      if (data.medication) {
        data.medication.forEach(element => {
          pdf.moveDown()
          mediactionTable.addBody([
            {
            title: 'Medication',
            value: element.name
          },
          {
            title: 'Dose',
            value: element.dose
          },
          {
            title: '',
            value: "",
          },
          {
            title: 'Monday',
            value: element.monday,
          },
          {
            title: 'Tueday',
            value: element.tuesday,
          },
          {
            title: 'Wednesday',
            value: element.wednesday,
          },
          {
            title: 'Thursday',
            value: element.thursday,
          },
          {
            title: 'Friday',
            value: element.friday,
          },
          {
            title: 'Saturday',
            value: element.saturday,
          },
          {
            title: 'Sunday',
            value: element.sunday,
          },
          {
            title: 'Plan Care',
            value: element.plan,
          }
        ])
        })
      }
      pdf.moveDown()


      if (data.social) {
          pdf.moveDown()
          table.addBody([{
            
          title: 'Mobility',
          value: data.social.mobility,
        },
        {
          title: 'Eating & Drinking',
          value: data.social.eating,
        },
        {
          title: 'Dressing',
          value: data.social.dressing,
        },
        {
          title: 'Toileting',
          value: data.social.toileting,
        },
        {
          title: 'Washing',
          value: data.social.washing,
        },
        {
          title: 'Notes on functions and activies',
          value: data.social.activity,
        },
        {
          title: 'Notes on behaviour',
          value: data.social.behaviour,
        }
        ])
      }

      pdf.end()
      Logger.info('PDF GENERATED')

      return  name+".pdf"
    } catch (error) {
      Logger.error(error)
    }
  }

   formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' of ' + monthNames[monthIndex] + ' of ' + year + ' at ' + hours + ':' + minutes + ':' + seconds;
  }



}

module.exports = new PdfService()
