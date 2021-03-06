
var assert = require('assert')
var Repo = require('../')

var snob = new Repo()
var world
var init = snob.commit(world = {
    hello: ['who', 'what', 'when','why']
  },
  { message: 'init', parent: 'master'})

assert.equal(init.depth, 1)

assert.equal(snob.getId('master'), init.id)

snob.branch('underdog', init.id)

var _world = snob.checkout(init.id)

assert.deepEqual(_world, world)

world.hello.splice(2, 0, 'how')

var second = snob.commit(world, {
    message: 'second',
    parent: 'master'
  })

console.log(second)
console.log(snob.revlist(second.id))

assert.deepEqual(
  snob.revlist(second.id), 
  [ init.id, second.id])

assert.deepEqual(second.depth, 2)

//a branch off init, so can test merge

_world.hello.push('WTF!?')
var branch = snob.commit(_world, {
    message: 'branch',
    parent: 'underdog' 
  })

assert.equal(branch.depth, 2)
console.log(branch)

var concestor = snob.concestor(branch.id, second.id)

assert.equal(concestor, init.id)
console.log(concestor)

var merged = snob.merge([branch.id, second.id], {message: 'merge1'})

console.log(merged)
assert.equal(3, merged.depth)

var world3 = snob.checkout(merged.id)

console.log(world3)


