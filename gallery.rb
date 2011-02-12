
require 'sinatra'
require 'haml'
require 'sass'
require 'flickr_fu'
require 'json'

FLICKR_YML = File.join('config', 'flickr.yml')

get '/' do
  #@title = "Yes"
  #haml :index
  redirect '/album'
end

get '/album' do
  @title = "Album"
  haml :album
end

get '/album/:id' do |id|
  photos = get_photos(best_size(params["width"], params["height"]))
  content_type :json
  { "photos" => photos }.to_json
end

get '/gallery.css' do
  scss :gallery
end

f = nil
def flickr
  f ||= Flickr.new(FLICKR_YML)
end

def get_albums
  flickr.photosets.get_list
end

def get_photos size
  flickr.photos.search(:user_id => flickr.auth.token.user_id).map do |p|
    s = p.photo_size(size)
    { "width" => s.width.to_i, "height" => s.height.to_i, "url" => s.source }
  end
end

def best_size width, height
  max = [width.to_i, height.to_i].max
  case 
  when max < 300 then :small
  when max < 600 then :medium
  else :large
  end
end

# monkey patch the flickr library
class Flickr::Photosets
  
  def create_attributes(photoset)
    {
      :id => photoset[:id], 
      :num_photos => photoset[:photos],
      :title => photoset.title.to_s,
      :description => photoset.description.to_s,
      :primary => photoset[:primary]
     }
  end

  class Photoset
    attr_accessor :primary
  end
  
end

def json
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


