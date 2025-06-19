
interface StudentResult {
  id: string;
  courseCode: string;
  courseTitle: string;
  creditUnits: number;
  score: number;
  grade: string;
  gradePoint: number;
  semester: string;
  session: string;
  remark: string;
}

interface StudentInfo {
  name: string;
  matricNumber: string;
  department: string;
  level: string;
  session: string;
  semester: string;
}

export const generateResultPDF = (
  studentInfo: StudentInfo,
  results: StudentResult[],
  cgpa: string,
  semesterGpa: string
) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const totalCredits = results.reduce((sum, result) => sum + result.creditUnits, 0);
  const currentDate = new Date().toLocaleDateString();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Student Result Slip - ${studentInfo.matricNumber}</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          
          body {
            font-family: 'Times New Roman', serif;
            font-size: 12px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            color: #000;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
          }
          
          .university-name {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
            text-transform: uppercase;
          }
          
          .university-address {
            font-size: 14px;
            margin-bottom: 10px;
          }
          
          .document-title {
            font-size: 16px;
            font-weight: bold;
            margin-top: 15px;
            text-decoration: underline;
          }
          
          .student-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
            padding: 15px;
            border: 1px solid #000;
          }
          
          .info-item {
            margin-bottom: 8px;
          }
          
          .info-label {
            font-weight: bold;
            display: inline-block;
            width: 120px;
          }
          
          .results-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          
          .results-table th,
          .results-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          
          .results-table th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
          }
          
          .results-table td:nth-child(3),
          .results-table td:nth-child(4),
          .results-table td:nth-child(5),
          .results-table td:nth-child(6) {
            text-align: center;
          }
          
          .summary-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-top: 20px;
            padding: 15px;
            border: 1px solid #000;
          }
          
          .summary-item {
            margin-bottom: 8px;
          }
          
          .grade-scale {
            margin-top: 20px;
            padding: 15px;
            border: 1px solid #000;
          }
          
          .grade-scale h4 {
            margin-top: 0;
            margin-bottom: 10px;
            text-align: center;
            font-weight: bold;
          }
          
          .grade-scale-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            font-size: 11px;
          }
          
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
          }
          
          .signature-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            margin-top: 40px;
            padding-top: 20px;
          }
          
          .signature-box {
            text-align: center;
            border-top: 1px solid #000;
            padding-top: 10px;
          }
          
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="university-name">Global Maritime Academy</div>
          <div class="university-address">Global Maritime Academy, P. O. Box 341, 886 Warri and Ughelli, Delta State, Nigeria</div>
          <div class="document-title">STUDENT RESULT SLIP</div>
        </div>

        <div class="student-info">
          <div>
            <div class="info-item">
              <span class="info-label">Name:</span>
              <span>${studentInfo.name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Matric Number:</span>
              <span>${studentInfo.matricNumber}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Department:</span>
              <span>${studentInfo.department}</span>
            </div>
          </div>
          <div>
            <div class="info-item">
              <span class="info-label">Level:</span>
              <span>${studentInfo.level}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Session:</span>
              <span>${studentInfo.session}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Semester:</span>
              <span>${studentInfo.semester} Semester</span>
            </div>
          </div>
        </div>

        <table class="results-table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Credit Units</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Grade Point</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            ${results.map((result, index) => `
              <tr>
                <td style="text-align: center;">${index + 1}</td>
                <td>${result.courseCode}</td>
                <td>${result.courseTitle}</td>
                <td>${result.creditUnits}</td>
                <td>${result.score}</td>
                <td>${result.grade}</td>
                <td>${result.gradePoint}</td>
                <td>${result.remark}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="summary-section">
          <div>
            <div class="summary-item">
              <span class="info-label">Total Credit Units:</span>
              <span>${totalCredits}</span>
            </div>
            <div class="summary-item">
              <span class="info-label">Semester GPA:</span>
              <span>${semesterGpa}</span>
            </div>
          </div>
          <div>
            <div class="summary-item">
              <span class="info-label">Cumulative GPA:</span>
              <span>${cgpa}</span>
            </div>
            <div class="summary-item">
              <span class="info-label">Date Generated:</span>
              <span>${currentDate}</span>
            </div>
          </div>
        </div>

        <div class="grade-scale">
          <h4>GRADING SYSTEM</h4>
          <div class="grade-scale-grid">
            <div>A (90-100): 4.0</div>
            <div>AB (80-89): 3.5</div>
            <div>B (70-79): 3.0</div>
            <div>BC (65-69): 2.5</div>
            <div>C (60-64): 2.0</div>
            <div>CD (55-59): 1.5</div>
            <div>D (50-54): 1.0</div>
            <div>E (45-49): 0.5</div>
            <div>F (0-44): 0.0</div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div>Registrar</div>
          </div>
          <div class="signature-box">
            <div>Date</div>
          </div>
        </div>

        <div class="footer">
          <p>This is an official document generated from the University Academic Management System</p>
          <p>For verification, contact the Registry Department</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

export const downloadResultAsPDF = async (
  studentInfo: StudentInfo,
  results: StudentResult[],
  cgpa: string,
  semesterGpa: string
) => {
  // For now, we'll trigger print which allows save as PDF
  // In a production environment, you might want to use a library like jsPDF or Puppeteer
  generateResultPDF(studentInfo, results, cgpa, semesterGpa);
  
  // Show toast notification
  const event = new CustomEvent('show-toast', {
    detail: {
      title: "PDF Generation",
      description: "Result slip opened in new window. Use your browser's print dialog to save as PDF.",
    }
  });
  window.dispatchEvent(event);
};
