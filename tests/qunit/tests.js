function reload () {
    var treebeard = Treebeard({filesData : 'small.json'});
    return treebeard.tbController;
}
module( "Load Tests" );

test('Treebeard is loaded', function(assert) {
    assert.ok(typeof tb === 'object', 'Treebeard is loaded as an object');
});

test('Treebeard has options', function(assert) {
    assert.ok(typeof tb.options === 'object', 'Treebeard has default options');
});

module( "ITEM API Tests" );
test('ITEM Constructor ', function (assert) {
    var item = tb.createItem({'kind': 'folder', 'name': 'Item API test folder'}, 1);
    assert.equal(item.kind, 'folder', 'Item constructor built the correct kind information and Added to parent');
    tb.deleteNode(item.parentID, item.id);

});

test('ITEM Move ', function (assert) {
    var item = tb.createItem({ 'kind': 'folder', 'name': 'Item API test folder'}, 1);
    var childItem =  tb.createItem({'kind': 'item', 'name': 'Item API test child'}, item.id);
    childItem.move(1);
    var topLevel = tb.find(1);
    var movedItem = topLevel.child(childItem.id);
    assert.equal(movedItem.data.name,'Item API test child', 'Moved item moved to the correct place');
    tb.deleteNode(item.parentID, item.id);
    tb.deleteNode(movedItem.parentID, movedItem.id);

});

test('ITEM Find ', function (assert) {
    var item = tb.createItem({'kind': 'folder', 'name': 'Item API test folder'}, 1);
    var foundItem = tb.find(item.id);
    assert.equal(foundItem.data.name, 'Item API test folder', 'Finding item by id works');
    tb.deleteNode(item.parentID, item.id);

});

test('ITEM find child by ID', function (assert) {
    var item = tb.createItem({'kind': 'folder', 'name': 'Item API test folder'}, 1);
    var childItem =  tb.createItem({'kind': 'item', 'name': 'Item API test child'}, item.id);
    var foundItem = item.child(childItem.id);
    assert.equal(foundItem.data.name,'Item API test child', 'Item child found with child()');
    tb.deleteNode(item.parentID, item.id);
});

test('ITEM Prev, next, parent find ', function (assert) {
    var item = tb.createItem({'kind': 'folder', 'name': 'Item API test folder'}, 1);
    var child1 =  tb.createItem({'kind': 'item', 'name': 'Child1'}, item.id),
        child2 =  tb.createItem({'kind': 'item', 'name': 'Child2'}, item.id),
        next = child1.prev(),
        prev = child2.next(),
        parent = child1.parent();
    assert.equal(next.data.name, 'Child2', 'Finds next() item correctly.');
    assert.equal(prev.data.name, 'Child1', 'Finds prev() item correctly.');
    assert.equal(parent.data.name, 'Item API test folder', 'Finds parent() item correctly.');
    tb.deleteNode(item.parentID, item.id);

});

test('ITEM is ancestor', function (assert) {
    var item = tb.createItem({'kind': 'folder', 'name': 'Item API test folder'}, 1),
        child =  tb.createItem({'kind': 'item', 'name': 'Child1'}, item.id),
        isAncestor = item.isAncestor(child);
    assert.ok(isAncestor, 'Check for isAncestor returns correctly')
    tb.deleteNode(item.parentID, item.id);

});

test('ITEM is descendant', function (assert) {
    var item = tb.createItem({'kind': 'folder', 'name': 'Item API test folder'}, 1),
        child =  tb.createItem({'kind': 'item', 'name': 'Child1'}, item.id),
        idDescendant = child.isDescendant(item);
    assert.ok(idDescendant, 'Check for isDescendant returns correctly');
    tb.deleteNode(item.parentID, item.id);
});

module( "Treebeard API tests" );

test('createItem()', function (assert) {
    var oldflatLength = tb.flatData.length;
    var expected = 'Test',
        item = tb.createItem({'kind': 'folder', 'name': expected}, 1);
    var newflatLength = tb.flatData.length;
    assert.equal(item.data.name, expected, 'Looked for : "' + expected + '" found: "' + item.data.name + '"');
    assert.equal(oldflatLength, newflatLength-1, 'Flatdata length is updated.');
    tb.deleteNode(item.parentID, item.id);

});

test('find()', function (assert) {
    var expected = 'Testing find',
        item = tb.createItem({'kind': 'folder', 'name': expected}, 1),
        foundItem = tb.find(item.id);
    assert.equal(foundItem.data.name, expected, 'Looked for : "' + expected + '" found: "' + foundItem.data.name + '"');
    tb.deleteNode(item.parentID, item.id);

});

test('deleteNode()', function (assert) {
    var item = tb.createItem({'kind': 'folder', 'name': 'Delete Test Parent'}, 1),
        parentID = item.id,
        childItem =  tb.createItem({'kind': 'item', 'name': 'Delete Test Child'}, parentID);
    tb.deleteNode(parentID, childItem.id);
    assert.equal(item.children.length, 0, 'Child item deleted.');
    tb.deleteNode(item.parentID, item.id);

});

test('canMove()', function (assert) {
    var item = tb.createItem({'kind': 'folder', 'name': 'Move Test Parent'}, 1),
        parentID = item.id,
        childItem =  tb.createItem({'kind': 'item', 'name': 'Move Test Child'}, parentID),
        outcome1 = tb.canMove(childItem, item),
        item2 =  tb.createItem({'kind': 'item', 'name': 'Move Sibling 2'}, 1),
        outcome2 = tb.canMove(item, item2);
    assert.ok(!outcome1, 'Can\'t move parent folder to child folder');
    assert.ok(outcome2, 'Can move sibling folder into sibling');
    tb.deleteNode(item.parentID, item.id);
    tb.deleteNode(item2.parentID, item2.id);

});


test('return index of item in the flatData, returnIndex()', function (assert) {
    var existingIndex = tb.returnIndex(2);
    var existingOutsideView = tb.returnIndex(104);
    var nonexistingIndex =  tb.returnIndex(200);
    assert.equal(existingIndex, 1, 'An existing item within view is returned correctly.');
    assert.equal(existingOutsideView, 103, 'An existing item outside view is returned correctly.');
    assert.equal(nonexistingIndex, undefined, 'A non existing item returned correctly as undefined.');
});

test('return index of item in the showRange, returnRangeIndex()', function (assert) {
    var existingIndex = tb.returnRangeIndex(104);
    var existingOutsideView = tb.returnRangeIndex(3);
    var nonexistingIndex =  tb.returnRangeIndex(200);
    assert.equal(existingIndex, 2, 'An existing item within view is returned correctly.');
    assert.equal(existingOutsideView, undefined, 'An existing item outside view is returned correctly as undefined.');
    assert.equal(nonexistingIndex, undefined, 'A non existing item returned correctly as undefined.');
});

//test('example', function(assert) {
//
//})

