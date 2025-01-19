// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;
    console.log("Metadata: ", metadata);
    // Filter the metadata for the object with the desired sample number
    let selSample = metadata.filter((result) => (result.id === Number(sample)));
    console.log("Inquiry Sample:", sample)
    console.log("Selected Sample:", selSample);

// Check if selSample has any results
    if (selSample.length > 0) {
    // Access the first element of the filtered result
      let sampleData = selSample[0];

    // Use d3 to select the panel with id of `#sample-metadata`
      let sampleMeta = d3.select("#sample-metadata");
      console.log("Sample Metadata: ", sampleMeta);
  
    // Use `.html("") to clear any existing metadata
      sampleMeta.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
      Object.entries(sampleData).forEach(([key, value]) => {
        console.log(key, value);
        sampleMeta.append("h5").text(`${key}: ${value}`);
    });
    } else {
        console.log("No sample found for the given ID");
  }});
};

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let selSample = samples.filter((result) => (result.id === sample));

    // Ensure that selSample has data
    if (selSample.length > 0) {
      // Get the first (and only) sample
      let sampleData = selSample[0];

      // Get the otu_ids, otu_labels, and sample_values
      let otu_ids = sampleData.otu_ids;
      let otu_labels = sampleData.otu_labels;
      let sample_values = sampleData.sample_values;

      // Build a Bubble Chart
      let trace = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers', // Specify the mode for Bubble Chart
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      };
      let layout = {
        title: "Bacteria in Sample",
        hovermode: "closest",
        xaxis: { title: "OTU ID" }
      };

      // Render the Bubble Chart
      Plotly.newPlot("bubble", [trace], layout);

      // For the Bar Chart, map the otu_ids to a list of strings for your yticks
      let yTicks = otu_ids.slice(0, 10).map((id) => `OTU ${id}`).reverse();

      // Build a Bar Chart
      // Don't forget to slice and reverse the input data appropriately
      let xTicks = sample_values.slice(0, 10).reverse();
      let labels = otu_labels.slice(0, 10).reverse();
      let trace1 = {
        x: xTicks,
        y: yTicks,
        text: labels,
        type: "bar",
        orientation: "h"
      };
      let layout1 = {
        title: "Top 10 Represented OTUs"
      };

      // Render the Bar Chart
      Plotly.newPlot("bar", [trace1], layout1);
    } else {
      console.error("Sample not found");
    }
  });
};

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((id) => {
      dropdown.append("option").text(id).property("value", id);
    });

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
