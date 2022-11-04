let cURL="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let eURL="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let cData,eData;

let canvas=d3.select('#canvas');
let tooltip = d3.select('#tooltip')

function drawMap(){
    canvas.selectAll('path')
        .data(cData)
        .enter()
        .append('path')
        .attr('d',d3.geoPath())
        .attr('class','county')
        .attr('fill',(cObj)=>{
            let id=cObj['id'];
            let country=eData.find((item)=>{
                return item['fips']===id
            })
            let percent=country['bachelorsOrHigher']
            if(percent<=15) return '#D7C0AE'
            if(percent<=30) return '#EEE3CB'
            if(percent<=65) return '#B7C4CF'
            else return '#967E76'
        })
        .attr('data-fips',(obj)=>{
            return obj['id'];
        })
        .attr('data-education',(obj)=>{
            let id=obj['id'];
            let country=eData.find((item)=>{
                return item['fips']===id
            })
            return country['bachelorsOrHigher']
        })
        .on('mouseover', (cItem) => {
            tooltip.transition()
                    .style('visibility', 'visible');
            cItem=cItem.srcElement.__data__;
            console.log(cItem)
            let fips = cItem['id']
            let county = eData.find((county) => {
                return county['fips'] === fips
            })
            tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + 
                county['state'] + ' : ' + county['bachelorsOrHigher'] + '%');
            tooltip.attr('data-education', county['bachelorsOrHigher'] )
        })
        .on('mouseout', (cItem) => {
            tooltip.transition()
                    .style('visibility', 'hidden')

        })
        
}

d3.json(cURL)
    .then((data,error)=>{ 
        if(error){
            console.log(error)
        }
        else{
            cData=topojson.feature(data, data.objects.counties).features;
            console.log(cData);
            d3.json(eURL).then(
                (data,error)=>{
                    if(error){
                        console.log(error);
                    }
                    else{
                        eData=data;
                        console.log(eData);
                        drawMap();
                    }
                }
            );

        }
    }
);


