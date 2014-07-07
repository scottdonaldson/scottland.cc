title: About
date: 2014-07-04
---

<script>
var days = new Date() - new Date('21 September 1987');
days = Math.ceil( days / ( 1000 * 60 * 60 * 24 ) );
days = days.toString().split('').reverse();
for ( var i = 0; i < days.length; i++ ) {
	days[i] = i % 3 === 2 ? ',' + days[i] : days[i];
}
days = days.reverse().join('');
</script>

<img alt="Scott Donaldson. Photo by Thomas Dunn." src="http://scottdonaldson.net/wp-content/uploads/2014/07/Scott-Donaldson-2014-1000x800.jpg">

<p>I'm a DC-based front-end web developer and caretaker of two bunnies. With designer Lisa Otto, I'm one half of the web team <a href="http://www.parsleyandsprouts.com" target="_blank">Parsley &amp; Sprouts</a>. I'm a cowriter and performer of the Internet comedy series <a href="http://resthome.scottdonaldson.net" target="_blank">'Rest Home</a>. You might also catch me writing for <a href="http://www.playgroundmisnomer.com/author/scott" target="_blank">Playground Misnomer</a>, a Midwest music blog. I'm <script>document.write(days);</script> days old. This site is for my other doings, thinkings, and makings. You might find them interesting also.</p>
<p>Email me at <a href="mailto:scott.p.donaldson@gmail.com">scott.p.donaldson@gmail.com</a>.</p>