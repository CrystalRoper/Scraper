$(function () {
    var currentArticleId = undefined;
    var currentArticleNotes = [];

    $(".notes").click(loadSelectedArticleNotes);
    $(".saveNote").click(saveNewNote);

    function loadSelectedArticleNotes(e) {
        currentArticleId = this.dataset.noteid;
        $.post("/notes", { id: currentArticleId }).then(function (data) {
            currentArticleNotes = data;
            rebuildCurrentNotes();
        });
    }

    function saveNewNote(e) {
        e.preventDefault();

        if (!currentArticleId) {
            console.error("attempted to save note with no currentArticleId");
            return;
        }

        var data = {
            articleId: currentArticleId,
            note: $("#newNote").val()
        };

        $.post("/note", data, function (response) {
            currentArticleNotes.push(response);
            rebuildCurrentNotes();
            $("#newNote").val("");
        });
    }

    function rebuildCurrentNotes() {
        console.dir(currentArticleNotes);
        $("#noteCount").text(currentArticleNotes.length);
        $("#currentNotes").html(currentArticleNotes.map(createNoteEntry));
    }

    function createNoteEntry(noteData) {
        return $("<li>")
            .addClass("list-group-item")
            .text(noteData.note)
            .append(createDeleteButton(noteData));
    }

    function createDeleteButton(noteData) {
        return $("<button>")
            .addClass("btn btn-danger")
            .css("float", "right")
            .text("X")
            .attr("data-noteid", noteData._id)
            .click(deleteNote);
    }

    function deleteNote(e) {
        $.post("/deletenote", { id: this.dataset.noteid }).then(function (deletedId) {
            for (var i = 0; i < currentArticleNotes.length; i++) {
                if (currentArticleNotes[i]._id == deletedId) {
                    currentArticleNotes.splice(i, 1);
                    break;
                }
            }

            rebuildCurrentNotes();
        });
    }
});