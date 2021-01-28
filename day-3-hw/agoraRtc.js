let handlefail = function(err) {
    console.log(err);
}

function addVideoStream(streamId){
    console.log("TEST")
    let remoteContainer_1 = document.getElementById("remoteStream_1");
    let remoteContainer_2 = document.getElementById("remoteStream_2");
    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.style.height = "250px"
    remoteContainer_1.appendChild(streamDiv)
    remoteContainer_2.appendChild(streamDiv)
} 

document.getElementById("join").onclick = function() {
    let channelName = document.getElementById("channelName").value;
    let Username = document.getElementById("username").value;
    let appId = "b5a866cbd0a64b6d88e4060c0186ea98";

    let client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"
    })
    
    client.init(appId, () => console.log("AgoraRTC Client Connected"), handlefail
    )

    client.join(
        null,
        channelName,
        Username,
        () => {
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })

            localStream.init(function() {
                localStream.play("SelfStream")
                console.log("App id: $(appId)\nChannel id: $(channelName)")
                client.publish(localStream)
            })
        }

    )

    client.on("stream-added", function (evt) {
        console.log("Added Stream");
        client.subscribe(evt.stream, handlefail)
    })

    client.on("stream-subscribed", function(evt) {
        console.log("Subscribed Stream");
        let stream = evt.stream;
        addVideoStream(stream.getId());  
        stream.play(stream.getId());
    })
}