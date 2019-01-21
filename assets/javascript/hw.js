$(document).ready(function() {    
    var topics=['parrot','duck','swan','turkey','pigeon','flamingo','eagle','peacock','seagulls','penguin','tweety','big bird'], 
    staticimg=[],gifimg=[],staticstatus=[{image:"",status:""}], currentid="",previd=[], pointer;
    

    //load gifs and animate
    function getGifs(pointer,numGif){   
        
        if (($(pointer).attr("id")!='submit') ){
            if(pointer == undefined){pointer=this;}
            if($(pointer).attr("value")!="Load 10 more gifs"){
                currentid=$(pointer).attr("value");
                if (previd[(previd.length-1)]!=currentid){
                    previd=[];
                    numOfPics=numGif;
                }
            }
            previd.push(currentid);
            
            //load 10 additional gifs
            if(($(pointer).attr("value")=="Load 10 more gifs") && previd.length>0){
                if(currentid!=""){
                    if((currentid===previd[(previd.length-1)]) || previd.length===1){
                        numOfPics=numOfPics+10;
                    }
                    
                }
            }
            if (previd[previd.length-1] != ""){
        
                //api address
                var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=jH0uAghmyuDvpp2NVi2uqVxYQSPEWnC4&q="+currentid+"&limit="+numOfPics+"&offset=0&rating=G&lang=en";
            
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
                        
                        $(".gif").append("<figure class='work'><img id=imgid"+j+" class='imgwidth' value="+j +" data-alt="+altimg+' alt= "0"'+
                        'src='+response.data[j].images.fixed_width_still.url+">"+"<p class='imgtxt'>Rating: "+response.data[j].rating+"</p></figure>");
                    }
                
                    //play and pause the gif
                    $('figure').on('click', function() {
                        staticstatus.image=parseInt($(this).children().attr('id').substring(5));
                        staticstatus.status=$(this).children().attr('alt');
                        if (staticstatus.status=="0"){
                            $(this).children("#imgid"+staticstatus.image).attr({src: gifimg[staticstatus.image], 'data-alt': staticimg[staticstatus.image], alt: "1"});
                        }
                        if (staticstatus.status=="1"){
                            $(this).children("#imgid"+staticstatus.image).attr({src: staticimg[staticstatus.image], 'data-alt': gifimg[staticstatus.image], alt: "0"});
                        }  
                    });
                });
            }   
        } 
    }
 
    //create all buttons
    for(var i=0; i<topics.length;i++){
        if((topics[i].indexOf(" ")) !=-1){
            var abc="'"+topics[i]+"'";
        }else{
            var abc=topics[i];
        }
        var button = $('<input type="button" id='+abc+' class="btn btn-primary ml-1 mr-1 mb-1 mt-1 buttonCol" value='+abc+ '>');
        button.appendTo(".topics");
    }   
    
    //grab the gifs
    function apicall(numGif){    
        $(":button").on("click", function(event){
            $(".gif").empty();
            
            staticimg=[];gifimg=[];staticstatus=[{image:"",status:""}];
            
            //Adding new buttons///////
            if ($(this).attr("id")=='submit'){
                event.preventDefault();
                var newt=$("#topicsAdd").val();
                if(topics.indexOf(newt) == -1){
                    if(($("#topicsAdd").val())!=""){
                        topics.push($("#topicsAdd").val());
                        if(($("#topicsAdd").val().indexOf(" ")) !=-1){
                            var abc="'"+$("#topicsAdd").val()+"'";
                        }else{
                            var abc=$("#topicsAdd").val();
                        }
                        var button = $('<input type="button" id='+abc+' class="btn btn-primary ml-1 mr-1 mb-1 mt-1 buttonCol" value='+abc+ '>');
                        button.appendTo(".topics");
                        previd=[];
                        numOfPics=numGif;

                        $(":button").on("click", function(event){
                            if (($(this).attr("id") != 'submit') && ($(this).attr("id") != 'tenMoreGif')){
                                $(".gif").empty();
                                staticimg=[];gifimg=[];staticstatus=[{image:"",status:""}];
                                pointer='<input type="button" id='+abc+' class="btn btn-primary ml-1 mr-1 mb-1 mt-1 buttonCol" value='+abc+ '>';
                                getGifs(pointer,numGif);
                            }
                        });
                        
                    }
                }
            } 
            
            if (($(this).attr("id") != 'submit')){
                getGifs(this,numGif);
            }
           
        }); 
        
    }

    //currently the minimum gifs are set to 10
    apicall(10);
});
    