(function(){
  var model = {
    init: function(){
      streamers = [];
    },
    add: function(streamer){
      streamers.push(streamer);
    },
    getAllStreamers: function(){
      return streamers;
    },
    getAllOnlineStreamers: function(){
      return streamers.filter(function(streamer){
        return (streamer.isStreaming == true);
      })
    },
    getAllOfflineStreamers: function(){
      return streamers.filter(function(streamer){
        return (streamer.isStreaming != true);
      })
    }
  };
  var controller = {
    init: function(){
      model.init();
      var streamers = ["destiny", "imaqtpie", "scarra","ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "habathcx", "RobotCaleb", "noobs2ninjas"];
      for(var i = 0; i < streamers.length; i++){
        this.addStreamer(streamers[i]);
      }
      displayStreamView.init();
      filterStreamerView.init();
    },
    getAllStreamers: function(){
      return model.getAllStreamers();
    },
    getAllOnlineStreamers: function(){
      return model.getAllOnlineStreamers();
    },
    getAllOfflineStreamers: function(){
      return model.getAllOfflineStreamers();
    },
    addStreamer: function(name){
      $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: "https://wind-bow.gomix.me/twitch-api/streams/"+name,
       // headers: { 'Api-User-Agent': 'TwitchStreamers/1.0' },
        success: function(data){
          if(data.stream){
             model.add({ 
               name: data.stream.channel.display_name,
               title: data.stream.channel.status,
               logo: data.stream.channel.logo,  
               url: data.stream.channel.url,
               isStreaming: true
            });
            displayStreamView.render();
          }else{
             $.ajax({
               type: "GET",
               dataType: "jsonp",
               url: "https://wind-bow.gomix.me/twitch-api/users/"+name,
               headers: { 'Api-User-Agent': 'TwitchStreamers/1.0' },
               success: function(data){
                 model.add({
                 name: data.display_name,
                 title: "Streamer offline",
                 logo: data.logo,
                 isStreaming: false
                 });        
                 displayStreamView.render();
               }
             }); 
          }

        },
        error: function(data){
          console.log("Error with the ajax request to the twitch api:\n"+data);
        }

      });
    },
    goToStream: function(obj){
      console.log(obj);
    }
  };
  var displayStreamView = {
    init: function(){
      this.$stream = $(".stream-display");
      this.render();
    },
    render: function(filterBy){
      switch(filterBy) {
        case "Online":
            this.streamers = controller.getAllOnlineStreamers();
            break;
        case "Offline":
            this.streamers = controller.getAllOfflineStreamers();
            break;
        default:
            this.streamers = controller.getAllStreamers();     
      }
      var html = "";
      // this.streamers.forEach(this.displayStreamer.bind(this));
      for(var i = 0; i < this.streamers.length; i++){
        html+= this.displayStreamer(this.streamers[i]);
      }
      this.$stream.html(html);
    },
    displayStreamer: function(streamer){
      var html = "";
      if(streamer.isStreaming){
        html = "<a href='"+streamer.url+"' target='_blank'> <div class='stream-online'>";  
      }else{
        html = "<div class='stream-offline'>"; 
      }
      
      html += "<img src='"+streamer.logo+"' alt= '"+streamer.name +" image'>";
      html += "<div class='streamer-name'>"+streamer.name+"</div>";
      html += "<div class='streamer-title'>"+ streamer.title+"</div>";
      html += "</div>";
      if(streamer.isStreaming){
        html+="</a>";
      }
      return html;
    }
  };
  var filterStreamerView = {
    init: function(){
      this.$menu = $(".menu");
      this.render();
    },
    render: function(){
      this.$menu.on('click','a',function(e){
        e.preventDefault();
        var menuLink = $(this);
        displayStreamView.render(menuLink.html());
        $(".selected").removeClass("selected");
        menuLink.addClass('selected');
      });
    }
  };
  controller.init();
})()