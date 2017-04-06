# What is Pocal?

It's a combination of browser-extensions and NodeJS server working together to let the user gain more control over their browser activities like clicking a link or searching with keywords.

# Why would one need this?

See [features](features.md)

* Manage custom search engines in a nicer, more powerful way

  The most important action a user can do in their browser is enter a URL or a search term in their address bar.
  Creating custom search keywords in browsers is often complex and limited.
  This lets you use regex and perform actions in NodeJS.

* Perform actions when clicking links.

  The second most important action a user can do in their browser is click links.
  It's often used by sites (google/reddit) to keep track of what their users are clicking on.
  This lets you perform custom actions when you click the link. The actions can be as simple as changing the link to something else (before letting the browser (or the site's pre-defined actions) do what they were gonna do), perform a side-effect action (like triggering off downloader), or any other javascript/nodejs action.

# How does it work?

The two main browser extensions are:

* [Greasemonkey userscript] that captures link clicks before they're processed by the browser and modifies them in place so that the browser carries out the action with the modified link instead of the original one or send this request to the server for processing (synchronously or asynchronously).

  With this you can modify the link into another link, or you may specify an instruction that invokes the server and it responds with an appropriate task, like respond with a modified URL that requires fetching some other website that could only be done via server intervention (which can't be done on client-side alone), or it may just be a side-effect action (like download a file simultaneously) while the client carries on with the url unchanged.

* [OpenSearch plugin] that redirects search queries to the server. This works similar to defining custom search keywords but it can do stuff on the NodeJS server, like [downloading a youtube video](../src/plugins/youtube-dl/README.md).

There's also a [plugin architecture](../src/plugins/README.md) to develop plugins to extend the above functionalities.

The server provides an easy web-based GUI to configure rules and other settings.

The userscript and custom search plugin are also served via the server itself.
