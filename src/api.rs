use actix_files::NamedFile;
use actix_web::{web, App, HttpServer, Responder, HttpRequest};
use std::path::PathBuf;
use rand::seq::SliceRandom;
use actix_web::http::header::{ContentDisposition, DispositionType, DispositionParam};

async fn get_gif() -> PathBuf {
    let gifs = std::fs::read_dir("./media").unwrap()
        .map(|res| res.map(|e| e.path()))
        .collect::<Result<Vec<_>, std::io::Error>>().unwrap();

    let gif = gifs.choose(&mut rand::thread_rng()).unwrap();
    return PathBuf::from(gif);
}

async fn serve_index(_req: HttpRequest) -> impl Responder {
    "tudou api :)\n\nendpoints:\n/api/tudou"
}

async fn serve_tudou(_req: HttpRequest) -> Result<NamedFile, std::io::Error> {
    let file = NamedFile::open(get_gif().await)?
        .set_content_type(mime::IMAGE_GIF)
        .set_content_disposition(ContentDisposition {
            disposition: DispositionType::Inline,
            parameters: vec![DispositionParam::Filename("cat.gif".parse().unwrap())],
        });
    Ok(file)
}

#[actix_web::main]
pub async fn listen() -> std::io::Result<()> {
    HttpServer::new(move || {
        App::new()
            .route("/", web::get().to(serve_index))
            .route("/api/tudou", web::get().to(serve_tudou))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
