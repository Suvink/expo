const path = require('path');
const fs = require('fs');

let sdkVersion = process.env.DOCS_VERSION;
if (sdkVersion === 'unversioned') {
  sdkVersion = 'UNVERSIONED'; // www API calls expect UNVERSIONED in all caps
} else {
  sdkVersion = sdkVersion.substring(1); // Remove the leading 'v' for numeric versions
}

let ExpSchema;
try {
  ExpSchema = require(`../../server/www/xdl-schemas/${sdkVersion}-schema.json`).schema;
} catch (e) {
  console.error(e.toString());
  return;
}

if (!process.argv[2]) {
  console.error('Please pass in the path to the target file');
}

const filePath = path.resolve(process.argv[2]);
const stream = fs.createWriteStream(filePath);

const preamble = `
\`\`exp.json\`\` is your go-to place for configuring parts of your app that don't belong in code. It is located at the root of your project next to your \`\`package.json\`\`.  The following is a full list of properties available to you.\
\n\n
`;

// Open and write!
stream.once('open', function(fd) {
  const readableSchema = [];
  Object.keys(ExpSchema.properties).forEach(key => {
    if (shouldDisplayProperty(ExpSchema.properties[key])) {
      readableSchema.push(extractData(key, ExpSchema.properties[key], ExpSchema));
    }
  });

  stream.write(".. _exp:\n\n");
  stream.write("Configuration with ``exp.json``\n");
  stream.write("========\n\n\n");


  stream.write(".. This file is automatically generated! Do not edit it directly -- see scripts/generate-exp-docs.js\n");
  stream.write(preamble);
  writePropertiesToStream(stream, readableSchema);
  stream.end();
});

function writePropertiesToStream(stream, schema, depth = 0) {
  schema.forEach(prop => {
    let depthSpacing = (new Array(depth)).join(' ');
    stream.write(`\n${depthSpacing}.. attribute:: ${prop.key}\n`);
    stream.write(`\n${depthSpacing} ${propertyDescription(prop, depthSpacing)}`);
    if (prop.children) {
      writePropertiesToStream(stream, prop.children, depth + 4);
    }
  });
}

/* Helper functions */

function propertyDescription(prop, depthSpacing) {
  let result = '';

  if (prop.isRequired) {
    result += '**Required**. ';
  }

  if (prop.isStandaloneOnly) {
    result += '**Standalone Apps Only**. ';
  }

  if (prop.description) {
    result += `${prop.description}\n`;
  }

  if (prop.validOptions) {
    result += `${depthSpacing} ${prop.validOptions}\n`;
  }

  return result;
}

function shouldDisplayProperty(property) {
  if (property.meta && property.meta.autogenerated) {
    return false;
  }

  return true;
}

function extractValidOptions(property) {
  if (property.enum && property.enum.length) {
    return property.enum.join(', ');
  } else if (property.meta && property.meta.regexHuman) {
    return property.meta.regexHuman;
  }
}

function determineIfStandaloneOnly(property) {
  return property.meta && property.meta.standaloneOnly;
}

function extractData(key, property, parent) {
  let description = (property.description || '').trim();
  let type = property.type;
  let validOptions = extractValidOptions(property);
  let isRequired = parent.required && parent.required.includes(key);
  let isStandaloneOnly = determineIfStandaloneOnly(property);

  let data = {
    description,
    isRequired,
    isStandaloneOnly,
    key,
    type,
    validOptions,
  };

  let children = property.properties;
  if (children) {
    let mappedChildren = [];
    Object.keys(children).forEach(key => {
      if (shouldDisplayProperty(children[key])) {
        mappedChildren.push(extractData(key, children[key], property));
      }
    });
    data = Object.assign(data, {children: mappedChildren});
  }

  return data;
}
