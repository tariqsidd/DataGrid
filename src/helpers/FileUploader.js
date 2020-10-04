import { Upload, Icon, message } from 'antd';
import React from 'react';
import csvtojson from 'csvtojson';
import { colors } from '@material-ui/core';

const { Dragger } = Upload;

// const props = {
//   name: 'file',
// multiple: false,
//   action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
//   onChange(info) {
//     const { status } = info.file;
//     if (status !== 'uploading') {
//       console.log(info.file, info.fileList);
//     }
//     if (status === 'done') {
//       message.success(`${info.file.name} file uploaded successfully.`);
//     } else if (status === 'error') {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },
//     accept=".txt, .csv"
//     showUploadList={ false}
//     beforeUpload={ file => {
//     const reader = new FileReader();

//     reader.onload = e => {
//         console.log(e.target.result);
//     };
//     reader.readAsText(file);

//     // Prevent upload
//     return false;
// }}
// };
export default class FileUploader extends React.Component {
  csvJSON(csv, dataType, getData) {
    // let count = 0;
    // let result = [];
    // result = csvtojson().fromString(csv);
    csvtojson()
      .fromString(csv)
      .then(data => {
        getData(data);
      });
    // csvtojson()
    //   .fromString(csv)
    //   .then(row => {
    //shakir parser

    // const lines = csv.split('\n');
    // let end = false;
    // for (let i = 0; i < lines.length; i++) {
    //   let obj = {};
    //   for (const prop in row[`${i}`]) {
    //     // console.log(row[`${i}`]);
    //     // console.log([prop] + ': ', `${row[`${i}`][prop]}`);
    //     obj[prop] = `${row[`${i}`][prop]}`;
    //     // result.push(row[`${i}`]);

    //     result.push(obj);
    //   }
    //   console.log('running');
    // }
    // })
    // .then(() => {
    //   console.log(result[0]);
    // });
    // console.log('result', result);
    //   return result;
  }

  render() {
    const { getData, dataType, fileName } = this.props;
    return (
      <Dragger
        style={{
          margin: '20px',
          border: '20px',
          backgroundColor: `${colors.orange[500]}`,
          borderRadius: 3,
          color: 'black',
          height: 48,
          padding: '30px',
          fontFamily: 'Arial',
          fontSize: '20px'
        }}
        accept=".csv"
        showUploadList={false}
        beforeUpload={file => {
          const reader = new FileReader();
          reader.fileName = file.name;

          reader.onload = e => {
            // fileName(e.target.fileName);
            this.csvJSON(e.target.result, 'csv', getData);
            // console.log(this.csvJSON(e.target.result))
          };
          reader.readAsText(file);

          // Prevent upload
          return false;
        }}>
        <p className="ant-upload-text">
          Click here to upload Order File for Route creation
        </p>
      </Dragger>
    );
  }
}
