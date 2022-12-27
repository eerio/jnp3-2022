vcl 4.0;
import directors;

backend f1 { .host = "front1"; .port = "3000"; }
backend f2 { .host = "front2"; .port = "3000"; }

sub vcl_init {
    new round_robin_director = directors.round_robin();
    round_robin_director.add_backend(f1);
    round_robin_director.add_backend(f2);
}

sub vcl_recv {
    return (pass);
}

sub vcl_backend_fetch {
    set bereq.backend = round_robin_director.backend();
}

sub vcl_deliver {
    if (obj.hits > 0) {
        set resp.http.X-Cache = "HIT hits=" + obj.hits;
    } else {
        set resp.http.X-Cache = "MISS";
    }
}