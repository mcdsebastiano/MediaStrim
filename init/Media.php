<?php 

function getDirContents($dir, &$result = array()) {
  $items = scandir($dir);
  foreach($items as $item => $name) {
    $path = $dir . DIRECTORY_SEPARATOR . $name;
    if(!is_dir($path)) {
      if($name == "desktop.ini" || pathinfo($path)['extension'] == "srt") 
        continue;
      $result[] = new Media($name, $path);
    } else if(!contains($name, "Subs") && $name != "." && $name != ".." && contains($path, "Videos")) {
		$path = str_replace("\\", "/", $path);
      getDirContents($path, $result[$path]);
    }
  }
  return $result;
}

function contains($haystack, $needle) {
  return strpos($haystack, $needle) !== false;
}

class Media {
	public static $tokens = array('/\./', '/\[/', '/\]/', '/\(/', '/\)/', '/\+/', '/\{/', '/\}/', '/\,/', '/-/',  '/_/', '/zeberzee/','/\b10bit\b/','/loki/','/avi/','/\bDTS\b/',
  '/\b5 1\b/','/GeekRG/','/OVA/','/MP4/','/mp3/','/BRRIP/','/MULVAcoded/','/YIFY/','/mp4/','/mkv/','/Eng/','/VPPV/','/H246/','/BRRip/','/WEB-DL/','/1080p/','/BluRay/',
  '/H264/','/x264/','/X264/','/BrRip/','/wmv/','/480p/','/anoXmous/','/720p/','/ECE/','/Subs/','/RARBG/','/AAC/','/MP3/','/576p/','/tv.net/','/-2hd/','/webrip/',
  '/\bJYK\b/','/\bx26\b/','/ShAaNiG/','/\b2160p\b/','/\b4K\b/','/\b0bit\b/','/HDR/','/\bYTS\b/','/\bLT\b/','/\beng\b/','/\btxt\b/','/srt/','/1080/','/DD5 1/',
  '/WEBRip/','/WebRip/','/WEBrip/','/x265/','/MOV/','/mpg/','/MPG/','/bitloks/','/BRrip/','/DVDRip/','/-FGT/','/flac/','/m4a/','/VOB/','/divx/');
	
	public $path;
	public $title;

  
	function __construct($title, $path) {
		$this->title = trim(preg_replace(Media::$tokens, ' ', $title)," ");
		$path = str_replace("\\", "/", $path);
		$this->path = substr($path, 0, strrpos($path, "/"));
		$this->source = substr($path, strrpos($path, "/"));
	}
}

