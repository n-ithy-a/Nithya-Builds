const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());

// ==================== HELPER ====================

function calculateStreak(rows) {

    if (rows.length === 0) return 0;

    const dates = rows
        .map(row => new Date(row.published_date))
        .sort((a, b) => b - a);

    let streak = 1;

    let current = new Date(dates[0]);

    current.setHours(0,0,0,0);

    for(let i=1;i<dates.length;i++){

        let prev = new Date(dates[i]);

        prev.setHours(0,0,0,0);

        const diff = Math.floor(

            (current-prev)/(1000*60*60*24)

        );

        if(diff===1){

            streak++;

            current=prev;

        }

        else{

            break;

        }

    }

    return streak;

}

// ==================== HOME ====================

app.get("/", async(req,res)=>{

    try{

        const result=await pool.query("SELECT NOW()");

        res.json({

            success:true,

            message:"Portfolio Backend Running",

            database:"Connected",

            serverTime:result.rows[0].now

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            error:err.message

        });

    }

});

// ==================== GET ALL BLOGS ====================

app.get("/api/blogs", async(req,res)=>{

    try{

        const result=await pool.query(

            `
            SELECT *

            FROM blogs

            ORDER BY published_date DESC
            `

        );

        res.json(result.rows);

    }

    catch(err){

        res.status(500).json({

            error:err.message

        });

    }

});

// ==================== GET BLOGS BY CATEGORY ====================

app.get("/api/blogs/category/:category", async(req,res)=>{

    try{

        const {category}=req.params;

        if(

            category!=="productManager"

            &&

            category!=="projects"

        ){

            return res.status(400).json({

                error:"Invalid Category"

            });

        }

        const result=await pool.query(

            `

            SELECT *

            FROM blogs

            WHERE category=$1

            ORDER BY published_date DESC

            `,

            [category]

        );

        res.json(result.rows);

    }

    catch(err){

        res.status(500).json({

            error:err.message

        });

    }

});

// ==================== ADD BLOG ====================

app.post("/api/blogs", async(req,res)=>{

    try{

        const{

            title,

            content,

            image,

            videoUrl,

            category,

            date

        }=req.body;

        const result=await pool.query(

            `

            INSERT INTO blogs

            (

            title,

            content,

            image,

            video_url,

            category,

            published_date

            )

            VALUES

            ($1,$2,$3,$4,$5,$6)

            RETURNING *

            `,

            [

                title,

                content,

                image,

                videoUrl,

                category,

                date

            ]

        );

        res.status(201).json(result.rows[0]);

    }

    catch(err){

        res.status(500).json({

            error:err.message

        });

    }

});
// ==================== UPDATE BLOG ====================

app.put("/api/blogs/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {

            title,
            content,
            image,
            videoUrl,
            category,
            date

        } = req.body;

        const result = await pool.query(

            `
            UPDATE blogs

            SET

                title=$1,

                content=$2,

                image=$3,

                video_url=$4,

                category=$5,

                published_date=$6,

                updated_at=NOW()

            WHERE id=$7

            RETURNING *;
            `,

            [

                title,

                content,

                image,

                videoUrl,

                category,

                date,

                id

            ]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                error: "Blog not found"

            });

        }

        res.json({

            success: true,

            blog: result.rows[0]

        });

    }

    catch (err) {

        res.status(500).json({

            error: err.message

        });

    }

});

// ==================== DELETE BLOG ====================

app.delete("/api/blogs/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `
            DELETE FROM blogs

            WHERE id=$1

            RETURNING *;
            `,

            [id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                error: "Blog not found"

            });

        }

        res.json({

            success: true,

            message: "Blog deleted"

        });

    }

    catch (err) {

        res.status(500).json({

            error: err.message

        });

    }

});

// ==================== GET USER ====================

app.get("/api/user", async (req, res) => {

    try {

        const result = await pool.query(

            `
            SELECT *

            FROM users

            LIMIT 1;
            `

        );

        res.json(result.rows[0]);

    }

    catch (err) {

        res.status(500).json({

            error: err.message

        });

    }

});

// ==================== GET STREAKS ====================

app.get("/api/streaks", async (req, res) => {

    try {

        const pm = await pool.query(

            `
            SELECT published_date

            FROM blogs

            WHERE category='productManager'

            ORDER BY published_date DESC;
            `

        );

        const projects = await pool.query(

            `
            SELECT published_date

            FROM blogs

            WHERE category='projects'

            ORDER BY published_date DESC;
            `

        );

        res.json({

            productManager: calculateStreak(pm.rows),

            projects: calculateStreak(projects.rows)

        });

    }

    catch (err) {

        res.status(500).json({

            error: err.message

        });

    }

});
// ==================== HEALTH CHECK ====================

app.get("/health", (req, res) => {

    res.json({

        success: true,

        status: "Backend Healthy 🚀"

    });

});

// ==================== START SERVER ====================

app.listen(PORT, () => {

    console.log("========================================");
    console.log("🚀 Nithyasree Portfolio Backend Running");
    console.log(`🌐 http://localhost:${PORT}`);
    console.log("🐘 PostgreSQL Connected");
    console.log("========================================");

});