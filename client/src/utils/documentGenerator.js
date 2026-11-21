/**
 * Swami Vivekanand Subharti University - Official Document Generator
 * Generates and downloads printable/PDF ready official university documents:
 * 1. University ID Card
 * 2. Fee Payment Receipt
 * 3. Examination Admit Card / Hall Ticket
 * 4. Semester Grade Card / Marksheet
 * 5. Official Bonafide / Character Letters
 * 6. University Notices & Circulars
 */

const SVSU_CREST_IMG = `
<img src="/svsu-logo.png" alt="Swami Vivekanand Subharti University Logo" width="82" height="82" style="object-fit: contain; display: inline-block; vertical-align: middle; background: #ffffff; border-radius: 50%; padding: 2px;" />
`;

function triggerPrintWindow(title, contentHtml) {
  const printWindow = window.open('', '_blank', 'width=900,height=750');
  if (!printWindow) {
    alert('Please allow popups to download or print this official document.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
          background: #f1f5f9;
          color: #0f172a;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .action-bar {
          width: 100%;
          max-width: 800px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          background: #ffffff;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .print-btn {
          background: #e11d48;
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }
        .print-btn:hover { background: #be123c; }
        .document-wrapper {
          background: #ffffff;
          width: 100%;
          max-width: 800px;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
          position: relative;
        }
        @media print {
          body { background: #ffffff; padding: 0; }
          .action-bar { display: none !important; }
          .document-wrapper { box-shadow: none; border: none; padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="action-bar">
        <div><strong>Official Document Viewer</strong> • Swami Vivekanand Subharti University</div>
        <button class="print-btn" onclick="window.print()">🖨️ Save as PDF / Print Document</button>
      </div>
      <div class="document-wrapper">
        ${contentHtml}
      </div>
      <script>
        // Auto trigger print dialog after document loads
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 600);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * 1. Download / Print Student ID Card
 */
export function downloadIdCard(student) {
  const content = `
    <div style="border: 3px solid #0f2137; border-radius: 12px; overflow: hidden; max-width: 480px; margin: 0 auto; box-shadow: 0 8px 24px rgba(0,0,0,0.15); background: #ffffff;">
      <!-- ID Header -->
      <div style="background: #0f2137; color: #ffffff; padding: 16px; text-align: center; border-bottom: 4px solid #f59e0b;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 6px;">
          ${SVSU_CREST_IMG}
          <div style="text-align: left;">
            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #ffffff; margin: 0;">SWAMI VIVEKANAND SUBHARTI UNIVERSITY</h2>
            <p style="font-size: 10px; color: #fbbf24; margin: 2px 0 0 0;">Subhartipuram, NH-58, Meerut - 250005 • NAAC 'A' Grade</p>
          </div>
        </div>
        <div style="background: #e11d48; display: inline-block; padding: 2px 14px; border-radius: 12px; font-size: 11px; font-weight: 800; letter-spacing: 1px;">
          STUDENT IDENTITY CARD
        </div>
      </div>

      <!-- ID Body -->
      <div style="padding: 20px; display: flex; gap: 18px; align-items: center;">
        <div style="width: 110px; height: 130px; background: #e2e8f0; border: 2px solid #cbd5e1; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;">
          <div style="font-size: 40px;">👨‍🎓</div>
          <span style="font-size: 9px; color: #64748b; font-weight: 600; margin-top: 4px;">STUDENT PHOTO</span>
        </div>
        <div style="flex: 1; font-size: 12px; line-height: 1.6;">
          <h3 style="font-size: 17px; color: #0f2137; margin: 0 0 6px 0; font-weight: 800;">${student.fullName}</h3>
          <p style="margin: 0;"><strong>Enrollment No:</strong> <span style="color: #e11d48; font-weight: 700;">${student.enrollmentNo}</span></p>
          <p style="margin: 0;"><strong>Roll No:</strong> ${student.rollNo}</p>
          <p style="margin: 0;"><strong>Course:</strong> ${student.course}</p>
          <p style="margin: 0;"><strong>Branch:</strong> ${student.branch || student.course}</p>
          <p style="margin: 0;"><strong>Batch:</strong> ${student.academicYear}</p>
          <p style="margin: 0;"><strong>Blood Group:</strong> <span style="color: #dc2626; font-weight: 700;">${student.bloodGroup || 'B+'}</span></p>
          <p style="margin: 0;"><strong>Emergency:</strong> ${student.phone}</p>
        </div>
      </div>

      <!-- ID Barcode & Stamp Footer -->
      <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-family: monospace; font-size: 16px; letter-spacing: 4px; font-weight: 800; color: #334155;">||| | |||| | ||||| ||</div>
          <div style="font-size: 9px; color: #64748b; margin-top: 2px;">ID: ${student.studentId} • VALID TILL: JUNE 2027</div>
        </div>
        <div style="text-align: center; width: 100px;">
          <div style="font-size: 9px; color: #64748b; border-top: 1px solid #94a3b8; padding-top: 2px; font-weight: 700;">REGISTRAR</div>
        </div>
      </div>
    </div>
  `;
  triggerPrintWindow(`Student_ID_Card_${student.enrollmentNo.replace(/[^a-zA-Z0-9]/g, '_')}`, content);
}

/**
 * 2. Download / Print Official Fee Payment Receipt
 */
export function downloadFeeReceipt(student, transaction) {
  const content = `
    <div>
      <!-- Letterhead -->
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0f2137; padding-bottom: 14px; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          ${SVSU_CREST_IMG}
          <div>
            <h1 style="font-size: 20px; color: #0f2137; margin: 0; font-weight: 800;">SWAMI VIVEKANAND SUBHARTI UNIVERSITY</h1>
            <p style="font-size: 11px; color: #64748b; margin: 2px 0 0 0;">Subhartipuram, NH-58, Delhi-Haridwar Bypass Road, Meerut - 250005 (UP)</p>
            <p style="font-size: 11px; color: #e11d48; font-weight: 700; margin: 2px 0 0 0;">FINANCE & ACCOUNTS DEPARTMENT • OFFICIAL FEE RECEIPT</p>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="background: #0f2137; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700;">ORIGINAL COPY</div>
          <p style="font-size: 11px; color: #475569; margin-top: 4px;">Date: ${transaction.date}</p>
        </div>
      </div>

      <!-- Receipt Meta -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; margin-bottom: 20px; font-size: 12.5px;">
        <div><strong>Receipt No:</strong> <span style="color: #e11d48; font-weight: 700;">${transaction.receiptNo}</span></div>
        <div><strong>Semester:</strong> ${transaction.semester}</div>
        <div><strong>Student Name:</strong> ${student.fullName}</div>
        <div><strong>Enrollment No:</strong> ${student.enrollmentNo}</div>
        <div><strong>Course / Branch:</strong> ${student.course}</div>
        <div><strong>Payment Mode:</strong> ${transaction.mode}</div>
      </div>

      <!-- Fees Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
        <thead>
          <tr style="background: #0f2137; color: #ffffff; text-align: left;">
            <th style="padding: 10px; border: 1px solid #0f2137;">S.No</th>
            <th style="padding: 10px; border: 1px solid #0f2137;">Particulars / Fee Head</th>
            <th style="padding: 10px; border: 1px solid #0f2137; text-align: right;">Amount (INR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">1</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">${transaction.purpose || 'Tuition & Development Fee'}</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">₹ ${(transaction.amount * 0.85).toLocaleString('en-IN')}.00</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">2</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">University Examination & Evaluation Fee</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">₹ ${(transaction.amount * 0.10).toLocaleString('en-IN')}.00</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">3</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">Library, Internet & ERP Maintenance Charges</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: right;">₹ ${(transaction.amount * 0.05).toLocaleString('en-IN')}.00</td>
          </tr>
          <tr style="background: #f1f5f9; font-weight: 800;">
            <td colspan="2" style="padding: 12px; border: 1px solid #cbd5e1; text-align: right;">TOTAL AMOUNT RECEIVED</td>
            <td style="padding: 12px; border: 1px solid #cbd5e1; text-align: right; color: #059669; font-size: 15px;">₹ ${transaction.amount.toLocaleString('en-IN')}.00</td>
          </tr>
        </tbody>
      </table>

      <!-- Status & Verification -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 36px; padding-top: 16px; border-top: 1px dashed #cbd5e1;">
        <div style="font-size: 11px; color: #64748b; line-height: 1.5;">
          <p style="margin: 0; color: #16a34a; font-weight: 700;">✔ PAYMENT STATUS: SUCCESS (NO DUES PENDING)</p>
          <p style="margin: 2px 0 0 0;">This is an ERP generated official transaction slip. No signature required.</p>
          <p style="margin: 2px 0 0 0;">Bar-code Verification: SVSU-ERP-${transaction.receiptNo.replace(/[^a-zA-Z0-9]/g, '')}</p>
        </div>
        <div style="text-align: center; width: 180px;">
          <div style="border-top: 1px solid #64748b; width: 160px; margin: 40px auto 4px; padding-top: 4px; font-size: 11px; font-weight: 700; color: #334155;">Authorised Cashier / Accounts</div>
        </div>
      </div>
    </div>
  `;
  triggerPrintWindow(`Fee_Receipt_${transaction.receiptNo.replace(/[^a-zA-Z0-9]/g, '_')}`, content);
}

/**
 * Helper to group/filter exams by academic year (Year 1, 2, 3, 4)
 */
export function getExamsForYear(examSchedule = [], targetYear) {
  if (!targetYear) return examSchedule;
  const targetYearNum = parseInt(targetYear, 10);
  
  // 1. Direct year match if exam has explicit year property or year in semester/code
  const explicitMatches = examSchedule.filter((e) => {
    if (e.year && parseInt(e.year, 10) === targetYearNum) return true;
    const str = `${e.semester || ''} ${e.subjectCode || ''} ${e.subjectName || ''}`.toLowerCase();
    if (str.includes(`year ${targetYearNum}`) || str.includes(`${targetYearNum}st year`) || str.includes(`${targetYearNum}nd year`) || str.includes(`${targetYearNum}rd year`) || str.includes(`${targetYearNum}th year`)) {
      return true;
    }
    return false;
  });
  if (explicitMatches.length > 0) return explicitMatches;

  // 2. Extract calendar years from date strings (e.g. 2017, 2018, 2019, 2020)
  const yearsMap = [];
  examSchedule.forEach((exam) => {
    const match = (exam.date || '').match(/\b(20\d\d|19\d\d)\b/);
    const yr = match ? parseInt(match[1], 10) : null;
    if (yr && !yearsMap.includes(yr)) {
      yearsMap.push(yr);
    }
  });
  yearsMap.sort((a, b) => a - b);

  if (yearsMap.length > 0 && targetYearNum <= yearsMap.length) {
    const matchedCalendarYear = yearsMap[targetYearNum - 1];
    const dateMatches = examSchedule.filter((exam) => {
      return (exam.date || '').includes(String(matchedCalendarYear));
    });
    if (dateMatches.length > 0) return dateMatches;
  }

  // 3. Fallback: split total schedule evenly across 4 years
  const total = examSchedule.length;
  if (total > 0) {
    const chunkSize = Math.ceil(total / 4);
    const start = (targetYearNum - 1) * chunkSize;
    const end = start + chunkSize;
    const slice = examSchedule.slice(start, end);
    if (slice.length > 0) return slice;
  }

  return examSchedule;
}

/**
 * 3. Download / Print Examination Admit Card / Hall Ticket (Supports Year 1, 2, 3, 4 filter)
 */
export function downloadAdmitCard(student, yearFilter = null) {
  const allExams = student.examSchedule || [];
  const examsToPrint = yearFilter ? getExamsForYear(allExams, yearFilter) : allExams;
  const yearHeading = yearFilter ? `YEAR ${yearFilter}` : (student.academicYear || 'ODD SEMESTER 2026-27');

  const examItems = examsToPrint.map((exam, idx) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: 700;">${exam.date}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">${exam.time}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: 700; color: #1d4ed8;">${exam.subjectCode}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">${exam.subjectName}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">${exam.room}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">__________</td>
    </tr>
  `).join('');

  const content = `
    <div>
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0f2137; padding-bottom: 12px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          ${SVSU_CREST_IMG}
          <div>
            <h1 style="font-size: 18px; color: #0f2137; margin: 0; font-weight: 800;">SWAMI VIVEKANAND SUBHARTI UNIVERSITY</h1>
            <p style="font-size: 11px; color: #64748b; margin: 2px 0 0 0;">Subhartipuram, NH-58, Delhi-Haridwar Bypass Road, Meerut - 250005</p>
            <p style="font-size: 12px; color: #e11d48; font-weight: 800; margin: 2px 0 0 0;">EXAMINATION ADMIT CARD / HALL TICKET (${yearHeading.toUpperCase()})</p>
          </div>
        </div>
        <div style="width: 85px; height: 100px; border: 1px solid #94a3b8; border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc;">
          <span style="font-size: 26px;">👨‍🎓</span>
          <span style="font-size: 8px; color: #64748b;">PHOTO</span>
        </div>
      </div>

      <!-- Student Metadata -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 12px;">
        <tr>
          <td style="padding: 4px 8px; font-weight: 700; width: 18%;">Student Name:</td>
          <td style="padding: 4px 8px; width: 32%;">${student.fullName}</td>
          <td style="padding: 4px 8px; font-weight: 700; width: 18%;">Roll Number:</td>
          <td style="padding: 4px 8px; width: 32%; color: #e11d48; font-weight: 800;">${student.rollNo}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px; font-weight: 700;">Enrollment No:</td>
          <td style="padding: 4px 8px;">${student.enrollmentNo}</td>
          <td style="padding: 4px 8px; font-weight: 700;">Year / Semester:</td>
          <td style="padding: 4px 8px;">${yearFilter ? `Year ${yearFilter}` : `Semester ${student.semester || 1}`}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px; font-weight: 700;">Father's Name:</td>
          <td style="padding: 4px 8px;">${student.fatherName || 'Shri Rajesh Sharma'}</td>
          <td style="padding: 4px 8px; font-weight: 700;">Course / Branch:</td>
          <td style="padding: 4px 8px;">${student.course}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px; font-weight: 700;">Exam Center:</td>
          <td colspan="3" style="padding: 4px 8px; font-weight: 600; color: #1e3a8a;">FET Main Block Examination Center, Meerut</td>
        </tr>
      </table>

      <!-- Exam Schedule Table -->
      <h3 style="font-size: 13px; color: #0f2137; margin: 0 0 8px 0; font-weight: 700;">SCHEDULE OF REGISTERED SUBJECTS (${yearHeading}):</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11.5px;">
        <thead>
          <tr style="background: #0f2137; color: #ffffff; text-align: left;">
            <th style="padding: 8px; border: 1px solid #0f2137;">#</th>
            <th style="padding: 8px; border: 1px solid #0f2137;">Exam Date</th>
            <th style="padding: 8px; border: 1px solid #0f2137;">Timing</th>
            <th style="padding: 8px; border: 1px solid #0f2137;">Code</th>
            <th style="padding: 8px; border: 1px solid #0f2137;">Subject Title</th>
            <th style="padding: 8px; border: 1px solid #0f2137;">Hall / Room</th>
            <th style="padding: 8px; border: 1px solid #0f2137;">Invigilator Sign</th>
          </tr>
        </thead>
        <tbody>
          ${examItems}
        </tbody>
      </table>

      <!-- Candidate Instructions -->
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 10px; font-size: 10.5px; color: #991b1b; line-height: 1.4; margin-bottom: 24px;">
        <strong>IMPORTANT CANDIDATE INSTRUCTIONS:</strong>
        <ol style="margin: 4px 0 0 16px; padding: 0;">
          <li>Candidate must carry this Admit Card along with the original University ID Card to the exam hall.</li>
          <li>Entry will not be permitted after 15 minutes of commencement of the examination.</li>
          <li>Electronic gadgets, mobile phones, smartwatches, and programmable calculators are strictly prohibited.</li>
        </ol>
      </div>

      <!-- Signatures -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 40px;">
        <div style="text-align: center;">
          <div style="border-top: 1px solid #64748b; width: 140px; padding-top: 4px; font-size: 11px; font-weight: 700;">Candidate Signature</div>
        </div>
        <div style="text-align: center;">
          <div style="border-top: 1px solid #64748b; width: 190px; padding-top: 4px; font-size: 11px; font-weight: 700;">Controller of Examinations (COE)</div>
        </div>
      </div>
    </div>
  `;
  const fileSuffix = yearFilter ? `Year_${yearFilter}` : 'Full';
  triggerPrintWindow(`Admit_Card_${student.rollNo}_${fileSuffix}`, content);
}

/**
 * 4. Download / Print Semester Marksheet / Grade Card
 */
export function downloadMarksheet(student, resultData) {
  const rows = (resultData.subjects || []).map((sub, i) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${i + 1}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: 700; color: #1d4ed8;">${sub.code}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">${sub.name}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${sub.credits}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${sub.internal}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${sub.external}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 700;">${sub.total}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 800; color: #059669;">${sub.grade}</td>
    </tr>
  `).join('');

  const content = `
    <div>
      <div style="text-align: center; border-bottom: 2px solid #0f2137; padding-bottom: 12px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: center; align-items: center; gap: 12px;">
          ${SVSU_CREST_IMG}
          <div>
            <h1 style="font-size: 20px; color: #0f2137; margin: 0; font-weight: 800;">SWAMI VIVEKANAND SUBHARTI UNIVERSITY</h1>
            <p style="font-size: 11px; color: #64748b; margin: 2px 0 0 0;">Subhartipuram, NH-58, Delhi-Haridwar Bypass Road, Meerut - 250005 (UP)</p>
            <p style="font-size: 13px; color: #e11d48; font-weight: 800; margin: 2px 0 0 0;">PROVISIONAL GRADE CARD / STATEMENT OF MARKS</p>
            <p style="font-size: 11px; color: #475569; font-weight: 600;">${resultData.semester.toUpperCase()} • EXAMINATION SESSION: ${resultData.examSession}</p>
          </div>
        </div>
      </div>

      <!-- Student Info -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px;">
        <tr>
          <td style="padding: 4px 8px; font-weight: 700; width: 18%;">Student Name:</td>
          <td style="padding: 4px 8px; width: 32%;">${student.fullName}</td>
          <td style="padding: 4px 8px; font-weight: 700; width: 18%;">Enrollment No:</td>
          <td style="padding: 4px 8px; width: 32%; color: #e11d48; font-weight: 800;">${student.enrollmentNo}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px; font-weight: 700;">Roll Number:</td>
          <td style="padding: 4px 8px;">${student.rollNo}</td>
          <td style="padding: 4px 8px; font-weight: 700;">Program / Course:</td>
          <td style="padding: 4px 8px;">${student.course}</td>
        </tr>
      </table>

      <!-- Marksheet Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11.5px;">
        <thead>
          <tr style="background: #0f2137; color: #ffffff; text-align: left;">
            <th style="padding: 8px; border: 1px solid #0f2137;">S.N.</th>
            <th style="padding: 8px; border: 1px solid #0f2137;">Sub Code</th>
            <th style="padding: 8px; border: 1px solid #0f2137;">Subject Description</th>
            <th style="padding: 8px; border: 1px solid #0f2137; text-align: center;">Credits</th>
            <th style="padding: 8px; border: 1px solid #0f2137; text-align: center;">Internal (30)</th>
            <th style="padding: 8px; border: 1px solid #0f2137; text-align: center;">External (70)</th>
            <th style="padding: 8px; border: 1px solid #0f2137; text-align: center;">Total (100)</th>
            <th style="padding: 8px; border: 1px solid #0f2137; text-align: center;">Grade</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <!-- Summary KPI Bar -->
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; font-size: 13px;">
        <div><strong>Semester Marks:</strong> <span style="font-size: 16px; color: #1d4ed8; font-weight: 800;">${resultData.marks || resultData.sgpa || '—'}</span></div>
        <div><strong>Cumulative CGPA:</strong> <span style="font-size: 16px; color: #f59e0b; font-weight: 800;">${student.cgpa}</span></div>
        <div><strong>Result Status:</strong> <span style="background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 4px; font-weight: 800;">${resultData.status}</span></div>
      </div>

      <!-- Footer Stamp -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 40px;">
        <div style="font-size: 10px; color: #64748b;">
          Disclaimer: This is a system-generated provisional marksheet published on ERP portal.<br/>
          Original grade certificate will be issued by the Examination Registrar.
        </div>
        <div style="text-align: center;">
          <div style="border-top: 1px solid #64748b; width: 180px; padding-top: 4px; font-size: 11px; font-weight: 700;">Controller of Examinations</div>
        </div>
      </div>
    </div>
  `;
  triggerPrintWindow(`Marksheet_${student.rollNo}_${resultData.semester.replace(/\s+/g, '_')}`, content);
}

/**
 * 5. Download Official Bonafide / Character / Internship Letter
 */
export function downloadOfficialLetter(student, letterType) {
  const isBonafide = letterType === 'bonafide';
  const isInternship = letterType === 'internship';
  
  let title = 'CHARACTER & CONDUCT CERTIFICATE';
  let refCode = 'SVSU/REG/CHAR/2026/102';
  let bodyText = `This is to certify that <strong>${student.fullName}</strong>, Son/Daughter of <strong>${student.fatherName || 'Shri Rajesh Sharma'}</strong>, having Enrollment No. <strong>${student.enrollmentNo}</strong>, is a student of <strong>${student.course}</strong> at Swami Vivekanand Subharti University Meerut.<br/><br/>To the best of our knowledge and university records, he/she bears an exemplary moral character, disciplined conduct, and has never been involved in any act detrimental to institutional decorum. We wish him/her success in all future pursuits.`;

  if (isBonafide) {
    title = 'BONAFIDE STUDENT CERTIFICATE';
    refCode = 'SVSU/REG/BONA/2026/894';
    bodyText = `This is to certify that <strong>${student.fullName}</strong>, S/o <strong>${student.fatherName || 'Shri Rajesh Sharma'}</strong>, bearing University Enrollment Number <strong>${student.enrollmentNo}</strong> and Roll Number <strong>${student.rollNo}</strong>, is a bonafide regular student of this University enrolled in the program <strong>${student.course}</strong> (Semester: <strong>${student.semester}</strong>) under the <strong>${student.department}</strong> for the academic session <strong>${student.academicYear}</strong>.<br/><br/>As per university records, his/her academic progress and disciplinary conduct during the study tenure have been found satisfactory. This certificate is issued upon student's request for official purposes.`;
  } else if (isInternship) {
    title = 'INTERNSHIP RECOMMENDATION & NO OBJECTION CERTIFICATE (NOC)';
    refCode = 'SVSU/TPO/INTERN/2026/418';
    bodyText = `This is to certify that <strong>${student.fullName}</strong>, Son/Daughter of <strong>${student.fatherName || 'Shri Rajesh Sharma'}</strong>, bearing Enrollment Number <strong>${student.enrollmentNo}</strong> and Roll Number <strong>${student.rollNo}</strong>, is a bonafide student of <strong>${student.course}</strong> (Semester: <strong>${student.semester}</strong>) in the <strong>${student.department}</strong> at Swami Vivekanand Subharti University, Meerut.<br/><br/>The University has <strong>No Objection</strong> to the student undertaking an industry Internship / Practical Training assignment. The training is recognized as a vital component for academic excellence and corporate exposure.<br/><br/>During his/her tenure at this institution, the student has maintained satisfactory academic standards and exemplary discipline. We strongly recommend him/her for the internship opportunity and wish them grand success in all professional endeavors.`;
  }

  const content = `
    <div>
      <!-- Official Letterhead -->
      <div style="text-align: center; border-bottom: 3px double #0f2137; padding-bottom: 16px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: center; align-items: center; gap: 14px;">
          ${SVSU_CREST_IMG}
          <div>
            <h1 style="font-size: 22px; color: #0f2137; margin: 0; font-weight: 800;">SWAMI VIVEKANAND SUBHARTI UNIVERSITY</h1>
            <p style="font-size: 11px; color: #64748b; margin: 2px 0 0 0;">(Established under UP Govt. Act 29 of 2008 & Accredited with 'A' Grade by NAAC)</p>
            <p style="font-size: 11px; color: #0f2137; margin: 2px 0 0 0;">Subhartipuram, NH-58, Delhi-Haridwar Bypass Road, Meerut - 250005</p>
            <p style="font-size: 11px; color: #1d4ed8; font-weight: 700; margin: 2px 0 0 0;">OFFICE OF THE REGISTRAR & TRAINING-PLACEMENT CELL</p>
          </div>
        </div>
      </div>

      <!-- Letter Ref and Date -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 12px; color: #475569;">
        <div><strong>Ref. No:</strong> ${refCode}</div>
        <div><strong>Date of Issue:</strong> ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
      </div>

      <!-- Letter Title -->
      <div style="text-align: center; margin-bottom: 28px;">
        <span style="font-size: 15px; font-weight: 800; color: #0f2137; border-bottom: 2px solid #e11d48; padding-bottom: 4px; text-transform: uppercase;">
          ${title}
        </span>
      </div>

      <!-- Body -->
      <div style="font-size: 14px; line-height: 1.8; color: #1e293b; text-align: justify; margin-bottom: 50px;">
        ${bodyText}
      </div>

      <!-- Signatory -->
      <div style="display: flex; justify-content: flex-end; align-items: flex-end; padding-top: 60px;">
        <div style="text-align: center;">
          <div style="border-top: 1.5px solid #0f2137; width: 220px; padding-top: 4px; font-size: 12px; font-weight: 700; color: #0f2137;">
            Registrar / Dy. Registrar<br/>
            <span style="font-size: 10px; color: #64748b; font-weight: 500;">Swami Vivekanand Subharti University</span>
          </div>
        </div>
      </div>
    </div>
  `;
  const docPrefix = isBonafide ? 'Bonafide_Certificate' : (isInternship ? 'Internship_NOC_Letter' : 'Character_Certificate');
  triggerPrintWindow(`${docPrefix}_${student.enrollmentNo.replace(/[^a-zA-Z0-9]/g, '_')}`, content);
}

/**
 * 6. Download Official Internship / Notis Circular Letter
 */
export function downloadNotice(notice) {
  const content = `
    <div>
      <!-- Official Letterhead -->
      <div style="text-align: center; border-bottom: 2px solid #0f2137; padding-bottom: 14px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: center; align-items: center; gap: 14px;">
          ${SVSU_CREST_IMG}
          <div>
            <h1 style="font-size: 20px; color: #0f2137; margin: 0; font-weight: 800;">SWAMI VIVEKANAND SUBHARTI UNIVERSITY</h1>
            <p style="font-size: 11px; color: #64748b; margin: 2px 0 0 0;">Subhartipuram, NH-58, Delhi-Haridwar Bypass Road, Meerut - 250005</p>
            <p style="font-size: 12px; color: #e11d48; font-weight: 800; margin: 2px 0 0 0;">OFFICIAL INTERNSHIP & NOTIS CIRCULAR</p>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; color: #475569;">
        <div><strong>Notis Ref:</strong> <span style="color: #e11d48; font-weight: 700;">${notice.refNo}</span></div>
        <div><strong>Date:</strong> ${notice.date}</div>
      </div>

      <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 16px; margin-bottom: 24px;">
        <h2 style="font-size: 16px; color: #1e3a8a; margin: 0 0 4px 0; font-weight: 800;">${notice.title}</h2>
        <span style="background: #2563eb; color: #ffffff; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase;">
          ${notice.category || 'Internship / General'}
        </span>
      </div>

      <div style="font-size: 13.5px; line-height: 1.8; color: #334155; margin-bottom: 40px; text-align: justify;">
        <p>${notice.description}</p>
        <p style="margin-top: 14px;">All concerned students, faculty members, and departments are requested to take note of the above instruction and comply accordingly.</p>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 50px; border-top: 1px dashed #cbd5e1;">
        <div style="font-size: 10px; color: #64748b;">
          Copy to:<br/>
          1. Hon'ble Vice Chancellor's Secretariat<br/>
          2. All Deans / Directors / Principals<br/>
          3. University Web Portal & Student Internship / Notis Board
        </div>
        <div style="text-align: center;">
          <div style="border-top: 1px solid #64748b; width: 220px; padding-top: 4px; font-size: 11px; font-weight: 700; color: #0f2137;">
            ${notice.signatory || 'Registrar / TPO Head, SVSU Meerut'}
          </div>
        </div>
      </div>
    </div>
  `;
  triggerPrintWindow(`Notis_${notice.refNo.replace(/[^a-zA-Z0-9]/g, '_')}`, content);
}
