const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const url = "https://obs.akdeniz.edu.tr/oibs//bologna/progCourses.aspx?lang=en&curSunit=1040";

request(url, (error, response, body) =>{

 try {
    const $ = cheerio.load(body);
    const table = $("#grdBolognaDersler");

    let semester = "";

    table.find("tr").each(function(){
      const row = $(this);
      const courseCode = row.find(`span[id^="grdBolognaDersler_lblDersKod_"]`);
      const courseName = row.find(`span[id^="grdBolognaDersler_lblDersAd_"]`);
      const courseAkts = row.find(`span[id^="grdBolognaDersler_lblAKTS_"]`);

      if (courseName.text().includes("Semester Course Plan")) {
        semester = `Semester${courseName.text().charAt(0)}`;
        if (!fs.existsSync(`${semester}.txt`)) {
          fs.writeFileSync(`${semester}.txt`, "");
        }else{
          fs.unlinkSync(`${semester}.txt`)
        }
      }
      if (![null,"","Code"].includes(courseCode.text())&&
                 ![null,"","Course Name"].includes(courseName.text())&&
                         ![null,"","ECTS"].includes(courseAkts.text())) {
        fs.appendFileSync(`${semester}.txt`, `${courseCode.text()}  ${courseName.text()} ${courseAkts.text()}\n`);
      }
  });
  }catch(err){
    console.log(err)
  }
});