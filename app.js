//initialize webpage
function init(){
  var dropdown = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    var current_sample = dropdown.node().value;
    var sampleNames = data.names;
    console.log(data);
    var samples = data.samples;
    //appending id values to dropdown bar
    sampleNames.forEach((sample) => {
      dropdown
        // selects from index.html 
        .append("option")
        //loads id value
        .text(sample)
        // displays interactive dropdown bar
        .property("value", sample);
    })
})
graph()
}
init();
// if subjectID is updated, re-graph for new subjectID
function optionChanged() {
  Plotly.restyle
  graph();
}
// function for generating plots
function graph() {
  var dropdown = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    var current_sample = dropdown.node().value;
    var sampleNames = data.names;
    console.log(data);
    var samples = data.samples;
    //appending id values to dropdown bar
    // sampleNames.forEach((sample) => {
    //   dropdown
    //     // selects from index.html 
    //     .append("option")
    //     //loads id value
    //     .text(sample)
    //     // displays interactive dropdown bar
    //     .property("value", sample);
    // })
    // returns ID value from original data object
    var current_sample = dropdown.node().value;
    
    // returns an object
    filtered = data.samples.filter(entry => entry.id == current_sample);
    console.log(filtered);
    var otu_ids = filtered[0].otu_ids;
    var sample_values = filtered[0].sample_values;
    var labels = filtered[0].otu_labels;
    //plot data for bar graph
    var bar_data = [{
      y: sample_values.slice(0, 10).map(otu_id => `OTU${otu_id}`).reverse(),
      x: otu_ids.slice(0, 10).reverse(),
      text: labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }]
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };
    Plotly.newPlot("bar", bar_data, barLayout);
    //bubble chart
    var trace1 = [{
      x: otu_ids.slice(0, 10).reverse(),
      y: sample_values.slice(0, 10).reverse(),
      text: labels,
      mode: 'markers',
      marker: {
        colorscale: 'Portland',
        size: sample_values,
        color: otu_ids
      }
    }];
    var layout = {
      title: 'otu',
      showlegend: false,
      height: 800,
      width: 1000,
      fixedrange: false
    };
    Plotly.newPlot("bubble", trace1, layout);
    //poulate demo_info
    var demo_info = d3.select("#sample-metadata")
    //resets panel for new subjectID
    demo_info.html("")
    //generate demographic table
    var metadata = data.metadata;
    //returns array of objects
    // console.log(metadata);
    // returning current ID for metadata
    var filteredMeta= data.metadata.filter(entry => entry.id == current_sample);
    console.log(filteredMeta);
    // prepare demo_info as an object to append
    var demo_data ={
     'age: ' : filteredMeta[0].age,
    'bbtype: ' : filteredMeta[0].bbtype,
    'ethnicity: ' : filteredMeta[0].ethnicity,
     'gender: ' : filteredMeta[0].gender,
     'ID: ' : filteredMeta[0].id,
     'location: ' : filteredMeta[0].location,
     'wfreq: ': filteredMeta[0].wfreq}
      //appending demo_data as object to panel
     Object.entries(demo_data).forEach(([key,value]) =>{
       demo_info.append('p').html(key + value)
     });
    // gauge
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        title: { text: "Washes Per Week" },
        type: "indicator",
        mode: "gauge",
        
        gauge: {
          axis: { range: [null,10 ] },
          steps: [
            { range: [0, 250], color: "Portland" },
            { range: [250, 400], color: "gray" }
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: filteredMeta[0].wfreq
          }
        }
      }
    ];
    var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
  Plotly.newPlot('myDiv', data, layout);
  })
}
//call the function
graph()

