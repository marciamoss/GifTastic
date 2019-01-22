$(document).ready(function() {    
    var topics=['birds of paradise','duck','swan','turkey','pigeon','flamingo','eagle','peacock','seagulls','penguin','parrot','pelican','tweety','big bird'], 
    staticimg=[],gifimg=[],staticstatus=[{image:"",status:""}], currentid="",prevFavS=[],prevFavG=[], pointer, loadClicks=[];

    //load gifs and animate
    function getGifs(pointer,maxGif,numGif){   
        if (($(pointer).attr("id")!='submit') ){
            if($(pointer).attr("value")!="Load 10 more gifs"){
                currentid=$(pointer).attr("value");
                loadClicks=[];
            }
            if (currentid != "" ){
                 //api address
                var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=jH0uAghmyuDvpp2NVi2uqVxYQSPEWnC4&q="+currentid+"&limit="+maxGif+"&offset=0&rating=G&lang=en";
            
                //data query based on button clicked
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function(response) { 

                    display(response.data,pointer,maxGif,numGif);
                });
            } 
        } 
    }

    function display(responsedata,pointer,maxGif,numGif){

        for(var j=0;j<responsedata.length;j++){      
            var image=("<img>");
            var altimg=responsedata[j].images.downsized_medium.url;
            gifimg.push(altimg);
            staticimg.push(responsedata[j].images.fixed_width_still.url);
        }
        
        // append 10 images at a time
        for(var j=0;j<numGif;j++){
            
            $(".gif").append("<figure class='work'><img id=imgid"+j+" class='imgwidth' value="+j +" data-alt="+gifimg[j]+' alt= "0"'+
            'src='+staticimg[j]+">"+"<p class='imgtxt'>Rating: "+responsedata[j].rating+" <img class='mt-1 favimg' src='assets/images/heart.png'></p></figure>");
            $(".favs").html("<h2>Add Favorites</h2>");
            
            //load prev favs into current topic
            if (prevFavS.length>0){
                for(var k=0;k<prevFavS.length;k++){
                    $(".favs").append("<div class='favgif'><img class='imgwidth' data-alt="+prevFavG[k]+' alt= "0"'+
                    'src='+prevFavS[k]+"></div>");
                }
            }
        }
        
        //load 10 additional gifs
        if(($(pointer).attr("value")=="Load 10 more gifs") ){
            
            if(currentid!=""){
                loadClicks.push(numGif);                
                lowerLimit=loadClicks[0];
                upperLimit=(((loadClicks.length)*loadClicks[0])+loadClicks[0]);
                if(upperLimit<=maxGif){
                    // append 10 images at a time
                    for(var j=lowerLimit;j<upperLimit;j++){
                        
                        $(".gif").append("<figure class='work'><img id=imgid"+j+" class='imgwidth' value="+j +" data-alt="+gifimg[j]+' alt= "0"'+
                        'src='+staticimg[j]+">"+"<p class='imgtxt'>Rating: "+responsedata[j].rating+" <img class='mt-1 favimg' src='assets/images/heart.png'></p></figure>");

                    }
                }
            }
        }

        //add favs
        $('.favimg').on('click', function(event) {
            event.preventDefault();
            var j=parseInt($(this).parent().parent().children().attr("value"));
            $(".favs").append("<div class='favgif'><img class='imgwidth mt-0' value="+j +" data-alt="+gifimg[j]+' alt= "0"'+
            'src='+staticimg[j]+"></div>");
            //load the favs into an array to be carried over from topic to topic
            prevFavS.push(staticimg[j]);
            prevFavG.push(gifimg[j]);
        });
        
        //play and pause the gif
        $('figure').on('click', function(event) {
            event.preventDefault();
            staticstatus.image=parseInt($(this).children().attr('id').substring(5));
            staticstatus.status=$(this).children().attr('alt');
            
            if (staticstatus.status=="0"){
                $(this).children("#imgid"+staticstatus.image).attr({src: gifimg[staticstatus.image], 'data-alt': staticimg[staticstatus.image], alt: "1"});
            }
            if (staticstatus.status=="1"){
                $(this).children("#imgid"+staticstatus.image).attr({src: staticimg[staticstatus.image], 'data-alt': gifimg[staticstatus.image], alt: "0"});
            }  
        });
    }
 
    //create all buttons
    for(var i=0; i<topics.length;i++){
        if((topics[i].indexOf(" ")) !=-1){
            var abc="'"+topics[i]+"'";
        }else{
            var abc=topics[i];
        }
        var button = $('<input type="button" id='+abc+' class="btn btn-primary ml-1 mr-1 mb-1 mt-1 buttonCol" btnType="oldbutton" value='+abc+ '>');
        button.appendTo(".topics");
    }     
    //grab the gifs
    function apicall(maxGif,numGif){    
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
                        var button = $('<input type="button" id='+abc+' class="btn btn-primary ml-1 mr-1 mb-1 mt-1 buttonCol" btnType="newbutton" value='+abc+ '>');
                        button.appendTo(".topics");
                        numOfPics=numGif;

                        $(":button").on("click", function(event){
                            event.preventDefault();
                            if (($(this).attr("id") != 'submit') && ($(this).attr("id") != 'tenMoreGif')  && ($(this).attr("btnType")!="oldbutton")){
                                $(".gif").empty();
                                staticimg=[];gifimg=[];staticstatus=[{image:"",status:""}];
                                pointer='<input type="button" id='+abc+' class="btn btn-primary ml-1 mr-1 mb-1 mt-1 buttonCol" btnType="newbutton" value='+abc+ '>';
                                getGifs(pointer,maxGif,numGif);
                            }
                        });
                    }
                }
            } 
            
            if (($(this).attr("id") != 'submit')){
                getGifs(this,maxGif,numGif);
                
            }
        }); 
    }
    //currently the minimum gifs are set to 10 and max fetch limit from api is set to 400
    apicall(400,10);

    //play and pause fav gif
    $(".favs").on('click','.favgif', function(event) {
        var favS=$(this).children().attr('src');
        var status=$(this).children().attr('alt');
        if (status=="0"){
            var index = prevFavS.indexOf(favS);
            $(this).children().attr({src: prevFavG[index], 'data-alt': prevFavS[index], alt: "1"});
        }
        if (status=="1"){
            var index = prevFavG.indexOf(favS);
            $(this).children().attr({src: prevFavS[index], 'data-alt': prevFavG[index], alt: "0"});
        }
    });
});
    