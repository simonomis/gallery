
require 'sinatra'
require 'haml'
require 'sass'

get '/' do
  @title = "Yes"
  haml :index
end

get '/album' do
  @title = "Album"
  haml :album
end

get '/album/:id' do |id|
  puts "id: " + id
  puts "size: " + params.to_s
  content_type :json
  '{ "photos": [
    {
      "url": "photos/1.jpg",
      "height": 240,
      "width": 320
    },
    {
      "url": "photos/2.jpg",
      "height": 240,
      "width": 320
    },
    {
      "url": "photos/3.jpg",
      "height": 320,
      "width": 240
    },
    {
      "url": "photos/4.jpg",
      "height": 240,
      "width": 320
    },
    {
      "url": "photos/5.jpg",
      "height": 240,
      "width": 320
    },
    {
      "url": "photos/6.jpg",
      "height": 320,
      "width": 240
    },
    {
      "url": "photos/7.jpg",
      "height": 240,
      "width": 320
    },
    {
      "url": "photos/8.jpg",
      "height": 240,
      "width": 320
    },
    {
      "url": "photos/9.jpg",
      "height": 320,
      "width": 240
    }
  ] }'
end

get '/gallery.css' do
  scss :gallery
end
