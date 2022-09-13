const neo4j = require('neo4j-driver')
const uuid = require('uuid')

require('dotenv').config()

const driver = neo4j.driver(
        process.env.NEO4J_URI,
        neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    )
const session = driver.session()

runQuery = async (query, queryParams) => {
    try {
        const result = await session.run(query, queryParams)

        return result.records.map(record => record?.get(0).properties)
    } catch (error) {
        console.log("Error running query: ", error)
    }
}

const getAll = async (state) => {
    let query
    if(state !== null) {
        query = 'MATCH(todos:Todo) WHERE todos.completed=$state RETURN todos'
    } else {
        query = 'MATCH(todos:Todo) RETURN todos'
    }

    const queryParams = {
        state: state
    }

    return await runQuery(query, queryParams)
}

const getById = async (id) => {
    const query = `MATCH(todo:Todo {id: "id"}) RETURN todo`

    const queryParams = {
        id: id
    }

    return await runQuery(query, queryParams)
}

const remove = async (id) => {
    const query = `MATCH(todo:Todo {id:"$id"}) DETACH DELETE todo`

    const queryParams = {
        props: {
            id: id
        }
    }

    return await runQuery(query, queryParams)
}

const edit = async (id, props) => {
    const query = `MATCH(todo:Todo {id:$id}) SET todo += $props RETURN todo`

    const queryParams = {
        id: id,
        props: props
    }

    return await runQuery(query, queryParams)
}

const create = async (taskName) => {
    const query = `CREATE(todo:Todo) SET todo += $props RETURN todo`

    const queryParams = {
        props: {
            name: taskName,
            id: uuid.v4(),
            creationDate: new Date(Date.now()).toISOString(),
            completed: false
        }
    }

    return await runQuery(query, queryParams)
}

module.exports = {
    getAll,
    getById,
    create,
    edit,
    remove
}