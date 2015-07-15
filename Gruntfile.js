module.exports = function(grunt){
	grunt.initConfig({
		aws: grunt.file.readJSON('aws.json'),
		s3: {
			staging: {
				options: {
					key: '<%= aws.key %>',
					secret: '<%= aws.secret %>',
					bucket: '<%= aws.bucketStaging %>',
					access: 'public-read'
				},
				sync: [{
					options: { verify: true },
					src: '_site/**/*.*',
					dest: '/',
					rel: '_site'
				}]
			},
			production: {
				options: {
					key: '<%= aws.key %>',
					secret: '<%= aws.secret %>',
					bucket: '<%= aws.bucketProduction %>',
					access: 'public-read'
				},
				sync: [{
					options: { verify: true },
					src: '_site/**/*.*',
					dest: '/',
					rel: '_site'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-s3');

	grunt.registerTask('production', ['s3:production']);
}
