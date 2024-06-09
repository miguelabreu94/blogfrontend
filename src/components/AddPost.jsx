import {Card, CardBody, Input} from "reactstrap"

const AddPost=()=>{
    return(
        <>
            <div className="wrapper">

            <Card>
                <CardBody>
                    <h3>Share your thoughts with a new post</h3>
                    <Form>
                        <div className="my-3">
                            <Label for="title" >Post title</Label>
                            <Input type="text" id="title" placeholder="Enter here" className="rounded-0"/>
                        </div>
                        <div className="my-3">
                            <Label for="content" >Post content</Label>
                            <Input type="textarea" id="content" placeholder="Enter here" 
                            className="rounded-0" style={{height:"300px"}}/>
                        </div>
                        <div className="my-3">
                            <Label for="category" >Post content</Label>
                            <Input type="select" id="category" placeholder="Enter here" 
                            className="rounded-0" />
                        </div>
                    </Form>

                </CardBody>

            </div>
        </>
    )
}