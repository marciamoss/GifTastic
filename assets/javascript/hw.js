$(document).ready(function() {    
    var fruit=['apple', 'banana', 'blueberry', 'cherry', 'dragonfruit', 'grape', 'grapefruit', 'watermelon', 'orange', 'peach', 'pear','plum', 'pineapple', 'strawberry']
    staticimg=[],gifimg=[],staticstatus=[{image:"",status:""}]; 
    
    //to add new button
    $(":button").click(function(){
        if ($(this).attr("id")=='submit'){
            if(($("#fruitAdd").val())!=""){
                fruit.push($("#fruitAdd").val());
                var button = $('<input type="button" id='+($("#fruitAdd").val())+' class="btn btn-primary ml-1 mr-1 mb-1 mt-1 buttonCol" value='+($("#fruitAdd").val())+ '>');
                button.appendTo(".fruits");
                apicall('<input type="button" id='+($("#fruitAdd").val())+' class="btn btn-primary ml-1 mr-1 mb-1 mt-1 buttonCol" value='+($("#fruitAdd").val())+ '>');
            }
        } 
    });

    //create all buttons
    for(var i=0; i<fruit.length;i++){
        var button = $('<input type="button" id='+fruit[i]+' class="btn btn-primary ml-1 mr-1 mb-1 mt-1 buttonCol" value='+fruit[i]+ '>');
        button.appendTo(".fruits");
    }   
    
    //grab the gifs
    function apicall(pointer){    
        $(":button").on("click", function(){
            $(".gif").empty();
            staticimg=[];gifimg=[];staticstatus=[{image:"",status:""}];

            if ($(this).attr("id")!='submit'){

                if(pointer == undefined){pointer=this;}
                //api address
                var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=jH0uAghmyuDvpp2NVi2uqVxYQSPEWnC4&q="+$(this).attr("value")+"&limit=24&offset=0&rating=G&lang=en";
                //data query based on button clicked
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function(response) { 
                    for(var j=0;j<response.data.length;j++){
                        var image=("<img>");
                        var altimg=response.data[j].images.downsized_medium.url;
                        gifimg.push(altimg);
                        staticimg.push(response.data[j].images.fixed_width_still.url);
                        
                        $(".gif").append("<img id=imgid"+j+" class='imgwidth ml-1 mr-1 mt-1 mb-1' value="+j +" data-alt="+altimg+' alt= "0"'+'src='+response.data[j].images.fixed_width_still.url+">");   

                        $('img').on('click', function() {
                            staticstatus.image=parseInt($(this).attr('id').substring(5));
                            staticstatus.status=$(this).attr('alt');
                        }); 
                    }
                    //play and pause the gif
                    $('figure').on('click', function() {
                        if (staticstatus.status=="0"){
                            $(this).children("#imgid"+staticstatus.image).attr({src: gifimg[staticstatus.image], 'data-alt': staticimg[staticstatus.image], alt: "1"});
                        }
                        if (staticstatus.status=="1"){
                            $(this).children("#imgid"+staticstatus.image).attr({src: staticimg[staticstatus.image], 'data-alt': gifimg[staticstatus.image], alt: "0"});
                        }  
                    });
                });
            } 
            
        }); 
    }
    apicall();
});
    