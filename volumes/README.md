Bind mounts and non-empty volumes always hide the file/directory in the container. However, empty volumes _merge_ into the volume.
   This is handy for copying a whole directory structure into a volume:
   - In the source container, mount a volume at the top of the directory structure (`--rm` is ok!).
   - In the destination container, mount the volume. Voila! Pile of files!

In code:

    docker volume ls # And "docker volume rm blog" if it's there.
    docker run --rm -v blog:/srv/jekyll iqa/demo_blog
    docker volume ls # Hey look, blog is there!
    docker run --rm -v blog:/dest alpine ls /dest

Unfortunately, you can't volume mount to the same mount point twice, so backing up does require manual copying (the /dest/src is a little workaround for `cp -R`s habit of copying directories rather than contents of directories):

    docker run --rm -v blog:/src -v blog_backup:/dest/src alpine cp -R /src /dest

Good use cases for all of this is anything to do with replacing input files, hiding files, etc. 

Gotcha: don't use a single letter as a volume name. Docker silently does nothing! I guess it's something to do with DOS drives?

Related: simple bind-mounting tricks (which also work with non-empty volumes):
- Redirect logging to the host for easier viewing.
- Add applications to any container (don't forget the shared libraries!)
- Swap out versions of libraries, configuration files and test data (databases).

