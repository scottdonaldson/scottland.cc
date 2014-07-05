module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		aws: grunt.file.readJSON('aws.json'),
		shell: {
			clean: {
				command: 'hexo clean'
			},
			generate: {
				command: 'hexo generate'
			},
			minify: {
				command: 'hexo gm'
			},
			server: {
				command: 'hexo server'
			}
		},
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
					src: 'public/**/*.*',
					dest: '/',
					rel: 'public'
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
					src: 'public/**/*.*',
					dest: '/',
					rel: 'public'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-s3');

	grunt.registerTask('default', ['shell:clean', 'shell:generate', 'shell:minify', 'shell:server']);
	grunt.registerTask('staging', ['shell:clean', 'shell:generate', 'shell:minify', 's3:staging']);
	grunt.registerTask('production', ['shell:clean', 'shell:generate', 'shell:minify', 's3:production']);
}