var url;
var videoId;
var isLoaded = false;
var privateMode = false;

// regular expressions used in the program, I highly suggest using regex101.com for a detailed explaination of the expression's inner workings
// gets the video id from the url inputted by the user
const videoIdExtractor =
  /(http(?: s) ?: \/\/(?:m.)?(?:www\.)?)?youtu(?:\.be\/|be\.com\/(?:watch\?(?:feature=youtu\.be\&)?v=|v\/|embed\/|user\/(?:[\w#]+\/)+))([^&#?\n]+)/;
// checks if the url is a valid youtube url and is something our player can play
const urlValidator =
  /((https(?:s)?:\/\/)?(www\.)?)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?&v=))((?:\w|-){11})((?:\&|\?)\S*)?/;
// expression to test if there are any whitspaces in our url
const whiteSpaceValidator = /\s/g;

function getVideoURL() {
  // gets our url from a prompt
  var hasWhiteSpace = whiteSpaceValidator.test(url);
  url = prompt("Insert the URL of the video you want to watch");
  if (hasWhiteSpace) {
    url.replace(/\s/g, "");
  }

  validateURL(url);
}

// TODO: add Vimeo support
// TODO: add ability to play youtube playlists

function validateURL(url) {
  // checks if link given is from youtube.com using regex
  // TODO: add logic to check if url links to existing video
  var isValidURL = urlValidator.test(url);
  if (!isValidURL && url.length !== 0 && url !== undefined) {
    alert("Invalid URL\nTry Again");
    refresh();
    getVideoURL();
  } else {
    getId(url);
  }
}

function getId(url) {
  // strips the video id from our url
  videoId = videoIdExtractor.exec(url)[2];
  loadVideo(videoId);
  return videoId;
}

function loadVideo(videoId) {
  document.querySelector("*").style.cursor = "wait";
  if (privateMode) {
    // sets the video player iframe's url to a youtube privacy-enhanced url(video doesn't show up on user's youtube search history) if the user has enabled Privacy Mode
    document.getElementById(
      "videoPlayer"
    ).src = `https://www.youtube-nocookie.com/embed/${videoId}`;
  } else {
    // sets the video player iframe's url to a youtube embed url (default)
    document.getElementById(
      "videoPlayer"
    ).src = `https://www.youtube.com/embed/${videoId}`;
  }
  // checks if the iframe content (our video) has loaded
  document.querySelector('iframe'). onload = function()
  { isLoaded = true;
    document.querySelector("*").style.cursor = "default";
  };
}

function openFullscreen() {
  // puts the player in full screen mode
  var player = document.getElementById("videoPlayer");
  if (player.src.length !== 0 && isLoaded) {
    if (player.requestFullscreen) {
      player.requestFullscreen();
    } else if (player.webkitRequestFullscreen) {
      /* Safari */
      player.webkitRequestFullscreen();
    } else if (player.msRequestFullscreen) {
      /* IE11 */
      player.msRequestFullscreen();
    } else {
      alert("Unable to open video in full screen");
    }
  } else {
    console.log("Error: unable to toggle full screen\nReason: no URL found");
    alert("We are unable to toggle full screen if a video hasn't been loaded\nPlease enter a URL first");
    getVideoURL();
  }
}

function refresh() {
  // allows the user to reset the player if they entered an invalid url or ran into another problem
  url = "";
  document.getElementById("videoPlayer").src = "";
  isLoaded = false;
  return isLoaded;
}

function shareVideo() {
  // copies shortened youtube url to the user's clipboard
  if (videoId !== undefined) {
    navigator.clipboard.writeText("https://youtu.be/" + videoId);
    alert("Link copied to clipboard");
  } else {
    console.log("Error: unable to copy shortened URL to clipboard\nReason: no URL found");
    alert("You haven't entered a URL to share\nPlay a video and try again");
    getVideoURL();
  }
}

function help() {
  // help if the user is stuck or wants to get info
  alert(
    "Thanks for using YT Player!\nUse the play icon to start watching videos, the full screen icon to play videos in full screen, the refresh button to reset the player,the lock to play videos in Private Mode, and the open button to open the video in a new tab.\nButtons that are grayed out are disabled and buttons that are black are enabled\nMade with ❤️ by UnrealApex\nThank you to all those who helped improve this project!"
  );
}

function openVideoInNewTab() {
  // opens a window that takes the user to the video on the youtube site for the purpose of liking or disliking the video
  if (isLoaded) {
    // TODO: change to responsive size
    let w = 1000;
    let h = 900;
    var left = screen.width / 2 - w / 2;
    var top = screen.height / 2 - h / 2;
    window.open(
      "https://www.youtube.com/watch?v=" + videoId,
      document.title,
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        top +
        ", left=" +
        left
    );
  } else {
    console.log("Error: unable to open video in new tab\nReason: no URL found");
    alert("We can't open video in new tab because you haven't entered a URL\n Play a video and try again");
    getVideoURL();
  }
}

function togglePrivateMode() {
  // toggles icon state for Private Mode and tells loadVideo function if it should load in Private Mode
  // Private Mode allows users to view videos on YT Player without them influening their YouTube and browsing experience.
  // For example, I'm a cat person and I want cat ads when I browse the internet. Say if I watched a video titled "Top 10 Reasons Why You Should Buy A Dog"
  // Next time I would go on the Verge (https://www.theverge.com/) I would be getting dog adverts. 
  // If I played the same video on YT Player with Private Mode on, I wouldn't get any dog ads nor would the video I watched be on my YouTube search history.
  if (!privateMode) {
    document.getElementById("private-mode").style.opacity = "100%";
    privateMode = true;
  } else if (privateMode) {
    document.getElementById("private-mode").style.opacity = "38%";
    privateMode = false;
  } else {
    console.log("Unable to toggle private mode");
  }
  return privateMode;

}
