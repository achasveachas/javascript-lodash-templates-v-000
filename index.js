function postComment() {
  var commenter = document.getElementById("commenterName").value;
  var comment = document.getElementById("commentText").value;

  var commentTemplate = '<div class="comment"><p><%= comment %></p><p>Posted By: <span class="commenter"><%= commenter %></span></p></div>';
  var templateFn = _.template(commentTemplate);

  var commentsDiv = document.getElementById('comments');

  var templateHTML = templateFn({'comment': comment, 'commenter': commenter});

  commentsDiv.innerHTML += templateHTML;
}
