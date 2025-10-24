module.exports = convertToText;
const fs = require('fs');
const path = require('path');

async function convertToText(auditLogData) {
    console.log('---Start of Converting JSON Audit Logs to Text Format---');
    
    try {
        const fileName = `audit_logs.txt`;
        const filePath = path.join(__dirname, '../../', fileName);
        
        // Convert audit log data to JSON string format
        const textContent = JSON.stringify(auditLogData, null, 2);
        
        // Write to file
        fs.writeFileSync(filePath, textContent, 'utf8');
        console.log(`Audit logs converted to text file: ${fileName}`);
        console.log(`Total Records: ${auditLogData.length}`);
        
        console.log('---End of Converting JSON Audit Logs to Text Format---');
        return filePath;
    } catch (error) {
        console.log(`Error during text conversion: ${error.message}`);
        throw error;
    }
}