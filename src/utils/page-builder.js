const { getImportMap, getImportsString } = require('./imports');

function getReadmePageJSX(htmlString) {
  const importMap = getImportMap();
  const imports = [importMap.readmePage];

  return `
  ${getImportsString(imports)}
  
  export default function Pages(){
    return <ReadmePage htmlString={\`${htmlString}\`} />
  }
  `;
}

module.exports = {
  getReadmePageJSX,
};
